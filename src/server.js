
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};


app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({extended: true})
);

app.use(cors(corsOptions));

app.route('/api/login').get( (req, res) => {
  console.log('DEBUG: /api/login', req.body);
  res.status(200).send({
    login: [{token: 'abcd'}, {instanceURL: 'login.salesforce.com'}]
  });
});


app.listen(8000, () => {
  console.log('Server started!');
});
