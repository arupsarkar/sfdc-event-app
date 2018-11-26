
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const session = require("express-session");
const http = require('http');
const path = require('path');

const app = express();
// Enable CORS
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
// Set our api routes
app.use('/api', api);

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/dist/sfdc-event'));
// app.get('/*', function(req,res) {
//   res.sendFile(path.join(__dirname+'/dist/sfdc-event/index.html'));
// });
/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);
/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port, () => console.log(`API running on localhost:${port}`));
