const express = require('express');
const jsforce = require("jsforce");
const router = express.Router();
const bodyParser = require("body-parser");
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
router.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
router.use(bodyParser.json());
/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/logout', (req, res) =>{
  console.log('DEBUG: Server logout()')
  const headers = req.headers.authorization;
  const params = headers.split('|');
  let accessToken = params[0];
  let instanceURL= params[1];
  let conn = new jsforce.Connection({
    instanceUrl : instanceURL,
    accessToken: accessToken
  });

  conn.logoutByOAuth2( function(data){
    console.log('DEBUG: Server logout() main function ', data);
    res.status(200).json({logout: 'success'});
  }).then(function (data){
    console.log('DEBUG: Server logout() then function ', data);
  }).catch( function(err){
    console.log('DEBUG: Server logout() error function ', err);
    res.status(200).json({logout: 'error'});
  });
  // conn.logout( function( data ){
  //   console.log('DEBUG: Server logout() main function ', data);
  //   res.status(200).json({logout: 'success'});
  // }).then(function( data ) {
  //   console.log('DEBUG: Server logout() then function ', data);
  // }).catch(function( data ){
  //   console.log('DEBUG: Server logout() error function ', data);
  //   res.status(200).json({logout: 'error'});
  // });
});

router.get('/getEvents', (req, res) => {
  console.log('DEBUG: SERVER: /events:');
  const headers = req.headers.authorization;
  const params = headers.split('|');
  let accessToken = params[0];
  let instanceURL= params[1];

  let eventsJSON = [];
  // instantiate a connection to salesforce
  let conn = new jsforce.Connection({
    instanceUrl : instanceURL,
    accessToken: accessToken
  });

  let types = [{type: 'CustomObject', folder: null}];
  conn.metadata.list(types, '43.0', function(err, metadata) {
    if (err) { return console.error('err', err); }
  }).then(function(data){
    //console.log('---> getEvents Response : ', res);

    for( let i = 0; i < data.length; i++) {
      let meta = data[i];
      //console.log(' Metadata Name - ', meta.fullName);
      if (meta.fullName.search('__e') !== -1) {
        console.log(' Metadata Name - ', JSON.stringify(meta));
        eventsJSON.push(meta);
      }
    }
    res.status(200).json(eventsJSON);
  }).catch(function(err){
    console.log('---> getEvents Error : ', err);
  });
});

// Subscribe to platform events
router.get('/events/subscribe/:fullName', (req, res) => {
  console.log('---> DEBUG: SERVER: /events/subscribe: Request params - ', req.params.fullName);
  const headers = req.headers.authorization;
  const params = headers.split('|');
  let accessToken = params[0];
  let instanceURL= params[1];
  // instantiate a connection to salesforce
  let conn = new jsforce.Connection({
    instanceUrl : instanceURL,
    accessToken: accessToken
  });
  conn.streaming.topic('/event/' + req.params.fullName).subscribe( function ( message ){
    console.log( '---> Event received - ', message );
    res.redirect( 'event-subscribe/subscribe?message=' + message );
  })
  .then(function(response){
    console.log('---> Events Subscribe then response - ', response);
    res.status(200).json(response);
  })
  .catch(function(err){
    console.log('---> Events Subscribe error - ', err);
    res.status(200).json(err);
  });
});

// Publish to platform events
router.get('/getEventDetail/:fullName', (req, res, next) => {
  console.log('---> DEBUG: SERVER: /eventDetail: Request query - ', req.query);
  console.log('---> DEBUG: SERVER: /eventDetail: Request params - ', req.params);
  console.log('---> DEBUG: SERVER: /eventDetail: Request params - ', req.params.fullName);
  let fullNames = [ req.params.fullName ];
  const headers = req.headers.authorization;
  const params = headers.split('|');
  let accessToken = params[0];
  let instanceURL= params[1];

  // instantiate a connection to salesforce
  let conn = new jsforce.Connection({
    instanceUrl : instanceURL,
    accessToken: accessToken
  });

  eventBusListener(conn, req.params.fullName, req, res);

  conn.metadata.read('CustomObject', fullNames, function(err, metadata) {
    if (err) { console.error(err); }
    for (let i=0; i < metadata.length; i++) {
      let meta = metadata[i];
      console.log("Full Name: " + meta.fullName);
      console.log("Fields count: " + meta.fields.length);
      // console.log("Sharing Model: " + meta.sharingModel);
    }
  }).then(function(data){
    console.log('---> get event detail success - ', data);
    res.status(200).json(data);
  }).catch(function(err){
    console.log('---> get event detail error - ', err);
  });

});


router.post('/events/publish', (req, res, next) =>{
  console.log('DEBUG: Server - /events/publish : ', 'Start');
  console.log('DEBUG: Server - /events/publish : data ', req.body);
  const headers = req.headers.authorization;
  const params = headers.split('|');
  let accessToken = params[0];
  let instanceURL= params[1];
  // instantiate a connection to salesforce
  let conn = new jsforce.Connection({
    instanceUrl : instanceURL,
    accessToken: accessToken
  });
  let platformEventJSONPayload = {};
  let platformEventObjectName = req.body.fullName;
  // Iterate the fields to create the JSOn Payload.
  for (let i = 0 ; i < req.body.fields.length; i++){
    platformEventJSONPayload[req.body.fields[i].fullName] = req.body.fields[i].data;
  }
  let azure_pe = conn.sobject(platformEventObjectName);
  console.log('---> JSON Payload : ', JSON.stringify(platformEventJSONPayload));
  azure_pe.create(platformEventJSONPayload, function( err, ret){
    console.log('---> Return : ', ret);
    console.log('---> Error : ', err);
    if(err || !ret.success){
      res.status(400).send(err);
    }
    console.log("DEBUG: Server - /events/publish : payload - ", ret);
    if (ret.success){
      console.log('DEBUG: Server - /events/publish : success - ', ret.success);
      res.status(200).json( ret );
    }
  });
});

function eventBusListener(conn, fullName, req, res ){
  console.log('---> Event Bus Listener : ', ' Started' );
  conn.streaming.topic('/event/' + fullName).subscribe( function ( message ){
    console.log( '---> Event received - ', message );
    if (message !== undefined){
      console.log( '---> Event fired  - ', message );
      req.io.sockets.emit('message', message);
    }
  });
}
module.exports = router;
