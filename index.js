// get relevent packages/libraries
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
// const {
//   Pool,
//   Client
// } = require('pg')
const http = require('http')
const socketIO = require('socket.io')

// create app using express and socket.io
const app = express();
const server = http.createServer(app)
const io = socketIO(server)
// setting pug as the view engine for the basic stuff
app.set('view engine', 'pug')
// routing the views to the correct folder
app.set('views', path.join(__dirname, '/server/views'));

// setting port
const port = process.env.PORT || 2000;

// adding body parser to app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// connection text for postgres sql server
// const connectionString = 'postgressql://postgres:hallgrimur@localhost:5432/testdb';
// creating the postgres client
// const client = new Client({
//   connectionString: connectionString
// });
// client.connect();


// start the server
server.listen(port, () => console.log('Decrypto website listening on port ${port}'));

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, '/client/build/')));

// get the routing system.    server/routes.js
require('./server/routes')(app, path, __dirname, express)


// get the socket.io system.    server/socketFunctions.js
let userbaseWithRooms = {};
io.on('connection', socket => {
  require('./server/socketFunctions')(socket, userbaseWithRooms);
})