const express = require('express');
const jsforce = require("jsforce");
const router = express.Router();
const bodyParser = require("body-parser");
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
const webpush = require('web-push');

// const vapidKeys = webpush.generateVAPIDKeys();
// console.log('---------Start Vapid keys -----');
// console.log(vapidKeys.publicKey);
// console.log(vapidKeys.privateKey);
// console.log('---------End Vapid keys -----');
const vapidKeys = {
  publicKey: 'BAUmjqCn6p5sznOyW2aBjyKm5DJtYOvcnHwFGYUJ7HPj9SBgqI5IMtx5OYhhXKGEezdtR6zx8NTkvJ2XPkZyeIg',
  privateKey: 'yzyN3l2gj99hjN1dagGH_j9YwhWvvSitmfRwRY4UTrY',
};
//
webpush.setVapidDetails(
  'mailto:arup.sarkar@salesforce.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
webpush.setGCMAPIKey('BPpaEUpzPTrKxivRFjGby40_LCTqTA1vbNUXyUXiLC3qIZ73TlpDSHSIDw0vbbyk-gmDNPM61DPUcELob04fAfs');
const pushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/dcR7IrrVl3s:APA91bFNmRF7cSQaNKkn-8SLZgvyOYKIUMmy3GUhOCS4VnOqZTAadYCFF0DrtjRNtjf8t1AMCz2pCZygqke5Ip8ddL1aPVkade4gbxtGUibw7EXnyRdHshW09JjRTksNMFHDOL5LT6dU',
  keys: {
    p256dh: 'BFrjjBsg7Cqgqz9uxOZrTjJ1c84TauPt40yicO37RvDd_YENQ_6u-ilGK0OOVyRr7hzF4HjogITXQhczXfoUloM',
    auth: 'Fbzo5MTYqSZKEstMtPxcYA'
  }
};

router.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
router.use(bodyParser.json());
router.use(logErrors);
router.use(clientErrorHandler);
router.use(errorHandler);
/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/config', function(req, res, next){
  console.log('DEBUG: Server config()');
  if(!(process.env.SFDC_CONSUMER_KEY) || !(process.env.SOCKET_SERVER_URL)){
    throw 'Error: Configuration variable SFDC_CONSUMER_KEY missing.';
  }
  try{
    let sfdc_consumer_key = process.env.SFDC_CONSUMER_KEY;
    let socket_server_url = process.env.SOCKET_SERVER_URL;
    console.log('DEBUG: Server - key - ', sfdc_consumer_key);
    console.log('DEBUG: Server - socket url - ', socket_server_url);
    res.status(200).json({'secret': sfdc_consumer_key, 'socket_server_url': socket_server_url});
  }catch(err){
    res.status(400).json(err);
    return next(err);
  }
});

router.get('/logout', (req, res, next) =>{
  console.log('DEBUG: Server logout()');
  const headers = req.headers.authorization;
  const params = headers.split('|');
  let accessToken = params[0];
  let instanceURL= params[1];
  let conn = new jsforce.Connection({
    instanceUrl : instanceURL,
    accessToken: accessToken
  });

  if ( conn === undefined){
    return next();
  }else{
    console.log('DEBUG: logout Connection user info - ', conn.userInfo);
  }
  conn.logout( function (err) {
    if (err) {
      res.status(400).json({logout: err});
      return next(err);
    } else {
      console.log('DEBUG: User successfully logged out.')
    }
  }).then( function (data) {
    console.log('DEBUG: User successfully logged out then function.', data);
    res.status(200).json({logout: 'success'});
  }).catch( function (error) {
    res.status(400).json(error);
    return next(error);
  })

  // conn.logoutByOAuth2( function(data){
  //   console.log('DEBUG: Server logout() main function ', data);
  //   res.status(200).json({logout: 'success'});
  // }).then(function (data){
  //   console.log('DEBUG: Server logout() then function ', data);
  // }).catch( function(err){
  //   console.log('DEBUG: Server logout() error function ', err);
  //   res.status(400).json(err);
  //   return next(err);
  // });
});

router.get('/getEvents', (req, res, next) => {
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

  if ( conn === undefined){
    return next();
  }else{
    console.log('DEBUG: getEvents Connection user info - ', conn.userInfo);
  }

  let types = [{type: 'CustomObject', folder: null}];
  conn.metadata.list(types, '43.0', function(err, metadata) {
    if (err) {
      res.status(400).json(err);
      return next(err);
    }else{
      return console.error('DEBUG getEvents() ', JSON.stringify(metadata));
    }
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
    res.status(400).json(err);
    return next(err);
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

  //check if conn object is undefined after a long response
  if ( conn === undefined){
    return next();
  }else{
    console.log('DEBUG: getEventDetail Connection user info - ', conn.userInfo);
  }

  eventBusListener(conn, req.params.fullName, req, res);

  conn.metadata.read('CustomObject', fullNames, function(err, metadata) {
    if (err) {
      console.error(err);
      res.status(400).json(err);
      return next(err);
    }
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
    res.status(400).json(err);
    return next(err);
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

  if ( conn === undefined){
    return next();
  }else{
    console.log('DEBUG: event/publish Connection user info - ', conn.userInfo);
  }

  let platformEventJSONPayload = {};
  let platformEventObjectName = req.body.fullName;
  // Iterate the fields to create the JSOn Payload.
  for (let i = 0 ; i < req.body.fields.length; i++){
    // convert string to date
    if (req.body.fields[i].type === 'DateTime' || req.body.fields[i].type === 'Date') {
      console.log('DEBUG: Datatype ', req.body.fields[i].type);
      console.log('DEBUG: Data value ', req.body.fields[i].type);
      platformEventJSONPayload[req.body.fields[i].fullName] = new Date(req.body.fields[i].data);
    } else {
      platformEventJSONPayload[req.body.fields[i].fullName] = req.body.fields[i].data;
    }

  }
  let azure_pe = conn.sobject(platformEventObjectName);
  console.log('---> JSON Payload : ', JSON.stringify(platformEventJSONPayload));
  azure_pe.create(platformEventJSONPayload, function( err, ret){
    console.log('---> Return : ', ret);
    console.log('---> Error : ', err);
    if(ret === undefined){
      console.log('Error publishing event: name - ', err.name);
      console.log('Error publishing event: code - ', err.errorCode);
      console.log('Error publishing event: fields - ', err.fields);
      res.status(400).json(err);
      return next(err);
      // res.status(500).json(err);
    }
    console.log("DEBUG: Server - /events/publish : payload - ", ret);
    if (ret !== undefined && ret.success){
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
      try{
        // Temporary: Create a web push message
        webpush.sendNotification(pushSubscription, new Buffer(JSON.stringify(message), 'utf8'))
          .then(
            function (data) {
              console.log('data: ', data);
            },
            function (err) {
              console.error('err: ', err);
            })
          .catch(function (ex) {
              console.error('err ex: ', ex);
          });
      }catch(e) {
        console.error('error in web push', e);
      }

    }
  });
}
// Error handlers
function logErrors (err, req, res, next) {
  console.error(err.stack);
  next(err)
}
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err)
  }
}

function errorHandler (err, req, res, next) {
  res.status(500);
  res.render('error', { error: err })
}

module.exports = router;
