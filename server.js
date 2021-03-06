
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const session = require("express-session");
const path = require('path');
const app = express();
const port = process.env.PORT || '3000';
const server = require('http').Server(app);
const io = require('socket.io')(server);
const kafka = require('no-kafka');
const Promise = require('bluebird');
const brokerUrls = process.env.KAFKA_URL.replace(/ + ssl/g,'');
const consumer = new kafka.SimpleConsumer({
  connectionString: brokerUrls,
  ssl: {
    certFile: process.env.KAFKA_CLIENT_CERT,
    keyFile: process.env.KAFKA_CLIENT_CERT_KEY
  }
});

console.log(new Date(), brokerUrls);

// const dataHandler = function (messageSet, topic, partition) {
//   return Promise.each(messageSet, function (m){
//     console.log("Topic: " + topic, ", Partition: " + partition, ", Offset: " + m.offset,
//       ", Message: " + m.message.value.toString('utf8'));
//     return consumer.commitOffset({topic: topic, partition: partition, offset: m.offset, metadata: 'optional'});
//   });
// };

// const strategies = [{
//   subscriptions: ['james-29939.interactions'],
//   handler: dataHandler
// }];

let producer = new kafka.Producer({
  connectionString: brokerUrls,
  ssl: {
    certFile: process.env.KAFKA_CLIENT_CERT,
    keyFile: process.env.KAFKA_CLIENT_CERT_KEY
  }
});
console.log(new Date(), ' producer init() - start');
producer
  .init()
  .then(r => { console.log(new Date()) , ' producer initialized ' + r})
  .catch((err) => { console.log(new Date()) , ' producer error ' + err} );
consumer
  .init()
  .catch((err) => { console.log(new Date() , ' producer error ' + err)})
  .then(() =>  { console.log(new Date()), 'consumer initialized ' });

console.log(new Date(), ' producer init() - end');
app.use( function (req, res, next) {
  req.producer = producer;
  req.consumer = consumer;
  next();
});

app.use(function(req, res, next) {
  req.io = io;
  next();
});

// app.use(function(err, req, res, next) {
//   if(err !== null || err !== undefined || err.toString().length > 0){
//     Console.log('DEBUG: Server app.use error : ', err);
//     next(err);
//   }
// });

// Enable CORS
app.use(cors());
app.options('*', cors()); // include before other routes
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
 * Listen on provided port, on all network interfaces.
 */
// app.listen(port, () => console.log(`API running on localhost:${port}`));
server.listen(port, () => console.log(`API running on localhost:${port}`));
