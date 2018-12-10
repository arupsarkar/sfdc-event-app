
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const session = require("express-session");
const path = require('path');
const app = express();
const port = process.env.PORT || '3000';
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(function(req, res, next) {
  req.io = io;
  next();
});

// // Enable CORS
app.use(cors());
app.options('*', cors()); // include before other routes
// const whitelist = ['http://localhost:3000', 'https://login.salesforce.com'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// };

// // Add headers
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   // Pass to next layer of middleware
//   next();
// });

// Initialize session
app.use(session(
  {
    secret: 'S3CRE7',
    resave: true,
    saveUninitialized: true
  }
));
// Get our API routes
const api = require('./api');

io.sockets.on('connection', function (socket) {
  console.log('client connect');
  socket.on('echo', function (data) {
    io.sockets.emit('message', data);
  });
});

// Set our api routes
app.use('/api', api);

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/dist/sfdc-event'));
app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/sfdc-event/index.html'));
});
/**
 * Get port from environment and store in Express.
 */
app.set('port', port);
/**
 * Listen on provided port, on all network interfaces.
 */
// app.listen(port, () => console.log(`API running on localhost:${port}`));
server.listen(port, () => console.log(`API running on localhost:${port}`));
