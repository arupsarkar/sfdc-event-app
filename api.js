const express = require('express');
const jsforce = require("jsforce");
const router = express.Router();
const {promisfy} = require('util');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

let mock_events = [
    {label: 'Lead Event Bus', api_name: 'lead_event__e'},
    {label: 'Case Event Bus', api_name: 'case_event__e'}
  ];
let eventsData = promisfy ( function(accessToken, instanceURL) {
  let eventsJSON = [];
  // instantiate a connection to salesforce
  let conn = new jsforce.Connection({
    instanceUrl : instanceURL,
    accessToken: accessToken
  });
  let types = [{type: 'CustomObject', folder: null}];

  let data = conn.metadata.list(types, '43.0', function(err, metadata) {
    if (err) { return console.error('err', err); }
    for( let i = 0; i < metadata.length; i++) {
      let meta = metadata[i];
      console.log(' Metadata Name - ', meta.fullName);
      if (meta.fullName === 'azure_iot__e') {
        console.log(' Metadata Name - ', JSON.stringify(meta));
        eventsJSON.push(meta);
      }
    }
  });
  return eventsJSON;
} );

router.get('/getEvents', (req, res) => {
  console.log('DEBUG: SERVER: /events:');
  const headers = req.headers.authorization;
  const params = headers.split('|');
  let accessToken = params[0];
  let instanceURL= params[1];
  let eventsJSON = eventsData(accessToken, instanceURL)
    .then(function(res){
      console.log(' Callback success : ',  res);
    })
    .catch(function(err){
      console.log(' Callback error : ',  err);
    });
  console.log('Events - ', JSON.stringify(eventsJSON));
  res.status(200).json ( eventsJSON );
});

router.get('/getEventDetail', (req, res, next) => {
  console.log('DEBUG: SERVER: /eventDetail:');
  res.status(200).json(mock_events[0]);
});

router.post('/events/publish', (req, res, next) =>{

  console.log('DEBUG: Server - /events/publish : ', 'Start');
  const headers = req.headers.authorization;
  const params = headers.split('|');

  let accessToken = params[0];
  let instanceURL= params[1];

  // instantiate a connection to salesforce
  let conn = new jsforce.Connection({
    instanceUrl : instanceURL,
    accessToken: accessToken
  });

  console.log('DEBUG: /events/publish : salesforce connection : ', conn);
  let azure_pe = conn.sobject('azure_iot__e');
  azure_pe.create({ message__c: 'This is a third test message'}, function( err, ret){
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

module.exports = router;
