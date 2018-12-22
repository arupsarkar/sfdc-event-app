var expect = require('chai').expect;
var request = require('request');

it('Main page content', function(done){
  request('https://sfdc-event-app.herokuapp.com/login', function (error, response, body) {
    console.log('DEBUG: Error - ', error);
    console.log('DEBUG: Response - ', response);
    console.log('DEBUG: Body - ', body);
    expect(body).to.equal('1234');
    done();
  });
});
