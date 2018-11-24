
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const jsforce = require("jsforce");
const app = express();
const path = require('path');
// const httpProxy = require('http-proxy');

// const apiForwardingUrl = 'http://localhost:4200';
// const apiProxy = httpProxy.createProxyServer();
//
// app.all("/api/*", function(req, res) {
//   apiProxy.web(req, res, {target: apiForwardingUrl});
//   console.log("Request made to /api/");
// });

// const originsWhitelist = [
//   'https://sfdc-event-app.herokuapp.com',      //this is my front-end url for development
//   'https://sfdc-api-app.herokuapp.com',
//   'http://localhost:4200',
//   'https://login.salesforce.com'
// ];
// const corsOptions = {
//   origin: function(origin, callback){
//     var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
//     callback(null, isWhitelisted);
//   },
//   credentials:true
// };
app.use(cors());
app.options('*', cors());
// const corsOptions = {
//   origin: 'https://localhost:4200',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({extended: true})
);


app.use(express.static(__dirname + '/dist/sfdc-event'));
app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/sfdc-event/index.html'));
});

app.route('/api/login').get( (req, res) => {
  console.log('DEBUG: /api/login', req.body);
  res.status(200).send({
    login: [{accessToken: 'abcd'}, {instanceURL: 'login.salesforce.com'}]
  });
});


app.listen(process.env.PORT || 8000, () => {
  console.log('Server started!');
});
