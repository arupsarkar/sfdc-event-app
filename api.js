const express = require('express');
const jsforce = require("jsforce");
const router = express.Router();
// declare axios for making http requests
const axios = require('axios');
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
  //redirectUri : 'https://sfdc-api-app.herokuapp.com/api/oauth2/callback'
});

// Use this api URL from the client for logging in salesforce using OAuth2.0
router.get("/oauth2/login", (req, res) => {
  console.log('/oauth2/login', req.query.code);
  // Redirect to Salesforce login/authorization page
  res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web refresh_token'}));
});

router.get('/oauth2/callback', (req, res) => {
  console.log('/oauth2/callback', req.query.code);
  const conn = new jsforce.Connection({oauth2: oauth2});
  const code = req.query.code;
  conn.authorize(code, function(err, userInfo) {
    if (err) {
      return console.error("This error is in the auth callback: " + err);
    }
    var v_accessToken = conn.accessToken;
    var v_instanceUrl = conn.instanceUrl;
    var v_refreshToken = conn.refreshToken;

    console.log('Access Token: ' + v_accessToken);
    console.log('Instance URL: ' + v_instanceUrl);
    console.log('refreshToken: ' + v_refreshToken);
    console.log('User ID: ' + userInfo.id);
    console.log('Org ID: ' + userInfo.organizationId);

    req.session.accessToken = v_accessToken;
    req.session.instanceUrl = v_instanceUrl;
    req.session.refreshToken = v_refreshToken;

    var string = encodeURIComponent('true');
    /* res.redirect('http://localhost:3000/?valid=' + string);
    });*/
    res.redirect('/');

  });
});


/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/login',  (req, res) => {
  console.log('DEBUG: /api/login', req.body);
  res.status(200).send({
    login: [{accessToken: 'abcd'}, {instanceURL: 'login.salesforce.com'}]
  });
});


// Get all posts
router.get('/posts', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/posts`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});


// // Get all posts
// router.get('/oauth2/login', (req, res) => {
//   // Get posts from the mock api
//   // This should ideally be replaced with a service that connects to MongoDB
//   axios.get(`${API}/oauth2/login`)
//     .then(posts => {
//       //res.status(200).json(posts.data);
//
//       console.log('/oauth2/login', req.query.code);
//       // Redirect to Salesforce login/authorization page
//       res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web refresh_token'}));
//     })
//     .catch(error => {
//       res.status(500).send(error)
//     });
// });

module.exports = router;
