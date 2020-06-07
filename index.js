const express = require('express');

const hubsModel = require('./data/hubs-model.js'); // <<<<< require data access

const server = express();

// middleware
// teach express how to read JSON fro the request body
server.use(express.json()); // <<<<<<<<<<<<<<<<<<<<<<<<<< we need this for POST and PUT

server.get('/', (req, res) => {
  // order matters, the first argument is the request
  res.send('hello node 22');
});

server.get('/hubs', (req, res) => {
  // get a list of hubs from the database
  hubsModel
    .find()
    .then(hubs => {
      // send the list of hubs back to the client
      res.send(hubs);
    })
    .catch(error => {
      res.send(error);
    });
});

// add a hub
server.post('/hubs', (req, res) => {
  // axios.post(url, data);
  // get the hub data from the request
  const hubData = req.body;

  // validate the data sent by he client
  // NEVER TRUST THE CLIENT!!!!!
  if (!hubData.name) {
    res.status(400).json({ message: 'gimme a name' });
  } else {
    // add the hub to the database
    hubsModel
      .add(hubData)
      .then(hub => {
        // send the hub back to the client
        res.json(hub); //.json() will set the right headers and convert to JSON
      })
      .catch(error => {
        res.json({ message: 'error saving the hub' });
      });
  }
});

server.delete('/hubs/:id', (req, res) => {
  // axios.delete('/hubs/2')
  const id = req.params.id; // params is an object with all the url parameters

  hubsModel
    .remove(id)
    .then(hub => {
      // send the hub back to the client
      res.json(hub); //.json() will set the right headers and convert to JSON
    })
    .catch(error => {
      res.json({ message: 'error deleting the hub' });
    });
});

server.put('/hubs/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  hubsModel
    .update(id, changes)
    .then(hub => {
      // send the hub back to the client
      res.json(hub); //.json() will set the right headers and convert to JSON
    })
    .catch(error => {
      res.json({ message: 'error updating the hub' });
    });
});

const port = 8080;
server.listen(port, () => console.log('\nserver running\n'));

// npm i express
// npm run server
// visit localhost:8000

// typos are the bane of developers
