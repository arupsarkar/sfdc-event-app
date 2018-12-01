const express = require('express');
const jsforce = require("jsforce");
const router = express.Router();
// const API = 'https://jsonplaceholder.typicode.com';
const API = 'https://sfdc-api-app.herokuapp.com/api';


//jsForce oauth2 connection
const oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl : 'https://login.salesforce.com',
  //clientId and Secret will be provided when you create a new connected app in your SF developer account
  clientId : '3MVG9zlTNB8o8BA2wrVtTcGwhEwLCayBmMKJEF6uILig.M9wPX3IHZTlE8W7OsJKeJ0Mc0cHvIPF_p_bmMAXx',
  clientSecret : '8963738011040646967',
  redirectUri : 'http://localhost:3000/api/oauth2/callback'
  // redirectUri : 'https://sfdc-event-app.herokuapp.com/api/oauth2/callback'
});


/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/getEvents', (req, res) => {
  console.log('DEBUG: SERVER: /events:');
  res.status(200).send({label: 'Lead Event Bus', api_name: 'lead_event__e'});
});

module.exports = router;
