const express = require('express');
const jsforce = require("jsforce");
const router = express.Router();
const bodyParser = require("body-parser");
const Promise = require('bluebird');
const Twit = require('twit');
const Kafka = require('no-kafka');
const producer = new Kafka.Producer();
const consumer = new Kafka.SimpleConsumer();
const {BigQuery} = require('@google-cloud/bigquery');
//create a big query client
const bigqueryClient = new BigQuery();
// Twitter integration - start
producer.init();
consumer.init();
let kafkaPrefix = process.env.KAFKA_PREFIX;
if (kafkaPrefix === undefined) {
  kafkaPrefix = '';
}
let T = new Twit({
  consumer_key:         'OPOJ9s3m93GXsuY8EvYa9OozW',
  consumer_secret:      'zmM5jvdnItCGskB2JpJd2yMU12d9OjtZ2x4lsBKymzcOyhSBvR',
  access_token:         '114372291-eTN2hW4Nt3ZG2a9z5bDBB5FWU8REWOuDsLjAmU2o',
  access_token_secret:  'pOP5oGaDjrwUkBxRk12Ijr63CWrEdGURW4c7aFRQkkiVa',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
  tweet_mode: 'extended'
});

let stream = T.stream('statuses/filter', { track: 'salesforce'});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function delayedTweetStream(conn) {
  stream.on('tweet', function (tweet) {
    console.log(new Date(), '---> Tweet JSON Data : ' + tweet);
    publishToKafka(tweet);
    //publishTweetToChatter(conn, decodeURI(tweet.text));
    return(tweet);
  });

}

function publishTweetToChatter(conn, data) {
  console.log(new Date(), '--> publishing post to chatter - Start');
  console.log(new Date(), '--> chatter data ' + data);
  conn.chatter.resource('/feed-elements').create({
    body: {
      messageSegments: [{
        type: 'Text',
        text: data
      }]
    },
    feedElementType : 'FeedItem',
    subjectId: 'me'
  }, function(err, result) {
    if (err) { return console.error(err); }
    console.log("Id: " + result.id);
    console.log("URL: " + result.url);
    console.log("Body: " + result.body.messageSegments[0].text);
    console.log("Comments URL: " + result.capabilities.comments.page.currentPageUrl);
  });
  console.log(new Date(), '--> publishing post to chatter - End');
}

router.get('/getTwitterUserDetails', (req, res, next) => {
  T.get('account/verify_credentials').then(user => {
    console.log(new Date(), '---> twitter user ' + JSON.stringify(user));
    res.send(user)
  }).catch(error => {
    res.send(error);
  });
});

let publishToKafka = (data) => {
 let tweet_data = {
   date: Date.now(),
   message: data
 };
 producer.send({
   topic: kafkaPrefix + 'interactions',
   message: {
     value: JSON.stringify(data)
   }
 }).then(r => {
      if(r) {
        console.log(new Date() , '---> result ' + JSON.stringify(r));
      }
    }
    );
};

router.get('/getTweets', (req, res, next) => {

  const headers = req.headers.authorization;
  const params = headers.split('|');
  let accessToken = params[0];
  let instanceURL= params[1];
  let conn = new jsforce.Connection({
    instanceUrl : instanceURL,
    accessToken: accessToken
  });

  if ( conn === undefined){
    console.log('DEBUG: getTweets Connection: conn object is null ');
    return next();
  }else{
    console.log('DEBUG: getTweets access token  - ', accessToken);
    console.log('DEBUG: getTweets instance url  - ', instanceURL);
    console.log('DEBUG: getTweets Connection user info - ', conn.userInfo);
  }

  try{
    let tweet = delayedTweetStream(conn);
    res.send(tweet);
  }catch(ex) {
    console.log(new Date() + 'Error getting tweets : ', ex);
    res.send({'error': ex});
  }
});
// Twitter integration - end


/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
// data handler function can return a Promise
let dataHandler = function (messageSet, topic, partition ) {
  console.log(new Date(), topic);
  console.log(new Date(), partition);
  console.log(new Date(), messageSet);
  // check for null
  if(messageSet) {
    messageSet.forEach(function (m) {
      //console.log(topic, partition, m.offset, m.message.value.toString('utf8'));
      console.log(JSON.stringify(m.message.value.toString('utf8')));
    });
  }

};

consumer.subscribe(kafkaPrefix + 'interactions', dataHandler).then(r => {
  if(r) {
    console.log(new Date(), '---> consumer result ' + JSON.stringify(r) ) ;
  }else {
    console.log(new Date(), '---> consumer result is null ') ;
  }
});

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

router.post('/searchSOSL', (req, res, next) => {
  console.log('---> DEBUG: SERVER: /searchSOSL: Request body - ', req.body);
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
    console.log('DEBUG: searchSOSL Connection user info - ', conn.userInfo);
  }

  conn.search("FIND {" + req.body.searchValue + "*} IN ALL FIELDS RETURNING Contact(Id, Name), Account(Id, Name), Lead(Id, Name)",
    function(err, result) {
      if (err) { res.status(200).json(err); }
      console.log(JSON.stringify(result));
      res.status(200).json(result.searchRecords);
    }
  );

});

router.post('/publishKafkaEvents', async (req, res, next) => {
  try {
    console.log(new Date(), 'post producer send() : start');
    console.log(new Date(), 'post producer req.body ' + JSON.stringify(req.body));

    return producer.init().then(await function(){
      return producer.send({
        topic: 'apalachicola-477.interactions',
        partition: 0,
        message: {
          value: JSON.stringify(req.body)
        }
      });
    })
      .then(await function (result) {
        console.log(new Date(), ' producer then block ' + JSON.stringify(result) );
      });

    // await req.producer.send({
    //   topic: 'apalachicola-477.interactions',
    //   partition: 0,
    //   message: {
    //     value: JSON.stringify(req.body)
    //   }
    // }).then(
    //   (data) => {
    //     console.log(new Date(), 'producer data : ' + JSON.stringify(data));
    //   },
    //   (err) => {
    //     console.log(new Date(), 'post producer err : ' + err);
    //   }
    // ).catch(
    //   (error) => {
    //     console.log(new Date(), 'post producer error : ' + error);
    //   }
    // ).finally(
    //   () => {
    //     req.consumer.init().then(() => {
    //       req.consumer.subscribe('apalachicola-477.interactions',[0,1,2,3,4,5,6,7], {}, dataHandlerBind).then();
    //     });
    //     console.log(new Date(), 'Post Producer send completed successfully.');
    //   }
    // );
    console.log('post producer send() : ', 'end');
  }catch(e) {
    console.log('ERROR: ', e.toLocaleString());
  }
});

router.post('/updateContact', (req, res, next) => {
  const headers = req.headers.authorization;
  const params = headers.split('|');
  let accessToken = params[0];
  let instanceURL= params[1];
  // instantiate a connection to salesforce
  let conn = new jsforce.Connection({
    instanceUrl : instanceURL,
    accessToken: accessToken
  });
// Single record update
  conn.sobject("Contact").update({
    Id : req.body.Id,
    FirstName : req.body.FirstName,
    LastName : req.body.LastName,
    MobilePhone : req.body.MobilePhone,
    Email : req.body.Email,
  }, function(err, ret) {
    if (err || !ret.success) { res.status(200).json(err); }
    console.log('Updated Successfully : ' + ret.id);
    res.status(200).json({'status': 'Updated successfully : ' + ret.id});
  });
});

// delete contact
router.post('/deleteContact', (req, res, next) => {
  console.log('---> DEBUG: SERVER: /deleteContact: Request query - ', req.query);
  console.log('---> DEBUG: SERVER: /deleteContact: Request params - ', req.params);
  console.log('---> DEBUG: SERVER: /deleteContact: Request body - ', req.body);
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
    console.log('DEBUG: createContact Connection user info - ', conn.userInfo);
  }
// Single record deletion
  conn.sobject("Contact").destroy(req.body.Id, function(err, ret) {
    if (err || !ret.success) { res.status(200).json(err); }
    console.log('Deleted Successfully : ' + ret.id);
    res.status(200).json({'Id': ret.Id});
  });
});
// create contact
router.post('/createContact', (req, res, next) => {
  console.log('---> DEBUG: SERVER: /createContact: Request query - ', req.query);
  console.log('---> DEBUG: SERVER: /createContact: Request params - ', req.params);
  console.log('---> DEBUG: SERVER: /createContact: Request body - ', req.body);
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
    console.log('DEBUG: createContact Connection user info - ', conn.userInfo);
  }
  conn.sobject("Contact").create({
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    MobilePhone: req.body.MobilePhone}, function(err, ret) {
    console.log('Create Contact : ', JSON.stringify(ret));
    if (err || !ret.success) {
      res.status(200).json(err);
    } else {
      res.status(200).json({'Id': ret.Id});
      console.log('Contact Id ', ret.id);
    }
  });

});
//get contacts
router.get('/getContacts', (req, res, next) => {
  console.log('---> DEBUG: SERVER: /getContacts: Request query - ', req.query);
  console.log('---> DEBUG: SERVER: /getContacts: Request params - ', req.params);
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
    console.log('DEBUG: getContacts Connection user info - ', conn.userInfo);
  }
  let records = [];
  let queryString = 'SELECT Id, FirstName, LastName, MobilePhone, Phone, Email FROM Contact ORDER BY LastModifiedDate DESC';
  conn.query(queryString, function (err, result) {
    if(err) {
      return console.error(err);
    }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
    console.log("done ? : " + result.done);

    if (!result.done) {
      // you can use the locator to fetch next records set.
      console.log("next records URL : " + result.nextRecordsUrl);
    }else {
      records = result.records;
      res.status(200).json(records);
    }
  })

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
  // change data capture listener
  eventBusChangeDataCapture(conn, req.params.fullName, req, res);


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
    }
  });
}

function eventBusChangeDataCapture(conn, fullName, req, res) {
  console.log('---> Event Bus change data capture Listener : ', ' Started' );
  conn.streaming.topic('/data/ChangeEvents').subscribe( async function ( message ){
    console.log( '---> CDC Event received - ', message );
    if (message !== undefined){
      console.log( '---> CDC Event fired  - ', message );
      //insert in to google big query
      let payload = message;
      const rows = [{crm_payload: payload}];
      // Insert data into a table
      await bigqueryClient
        .dataset('sfdc_dataset')
        .table('crm_table')
        .insert(rows)
        .then((data) => {
          console.log(' success loading data into big query : ' + JSON.stringify(data));
        })
        .catch((err) =>{
          console.log(' error loading data in big query table : ' + JSON.stringify(err));
        })
      console.log(`Inserted ${rows.length} rows`);

      req.io.sockets.emit('message', message);
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
