'use strict';

var sinon = require('sinon')
var should = require('should');
var Promise = require('bluebird')
var _ = require('lodash')
var setup = require('./../mocks/setup');
var fixtures = Promise.promisifyAll(require('node-mongoose-fixtures'));
var service = require('./../../src/services/user');
var service = require('./../../src/services/user');
var sinon = require('sinon')
var User = require('./../../src/models/user');
var assert = require('assert')

setup.makeSuite('user manager', function() {

  before(function before(done) {
    fixtures.resetAsync('User')
    .then(function(result) {
      done()
    })
  })

  it('should register user', function test(done) {
    service.register({
      email: 'jan@mailinator.com',
      password: 'jan'
    })
    .then(function(user) {
      user.authenticate('jan', function(err, res) {
      assert.equal(null, err)
      res.should.have.property('is_admin', false)
      user.should.have.property('is_admin', false)
      user.should.have.property('email', 'jan@mailinator.com')
      user.should.have.property('hash')
      done()

      })


    })
  })

  it('cannot register user with same email', function test(done) {
    service.register({
      email: 'jan@mailinator.com',
      password: 'jan'
    })
    .catch(function(err) {
      done()
    })
  })

  it('cannot register user with empty password', function test(done) {
    service.register({
      email: 'jan2@mailinator.com',
      password: ''
    })
    .catch(function(err) {
      console.log(err);
      done()
    })
  })

  it('should update user with facebook data', function test(done) {
    service.updateFacebookUser('', '', {
      emails: [{
        value: 'joe@mailinator.com'
      }],
      photos: [{
        value: 'image.jpg'
      }],
      id: 12345,
      displayName: 'Joe Joe'
    })
    .then(function(user) {
      user.facebook.should.have.property('name', 'Joe Joe')
      user.facebook.should.have.property('id', 12345)
      user.should.have.property('name', 'Joe Joe')
      user.should.have.property('email', 'joe@mailinator.com')
      user.should.have.property('picture', 'image.jpg')
      done()
    })
  })

  it('should register facebook user', function test(done) {
    service.updateFacebookUser('', '', {
      emails: [{
        value: 'mark@mailinator.com'
      }],
      id: 12345,
      displayName: 'Mark Zuck'
    })
    .then(function(user) {
      user.facebook.should.have.property('name', 'Mark Zuck')
      user.facebook.should.have.property('id', 12345)
      user.should.have.property('email', 'mark@mailinator.com')
      done()
    })
  })

  it('should register facebook user without email', function test(done) {
    service.updateFacebookUser('', '', {
      id: 333,
      displayName: 'No Email'
    })
    .then(function(user) {
      user.facebook.should.have.property('name', 'No Email')
      user.facebook.should.have.property('id', 333)
      done()
    })
  })

  it('should register github user', function test(done) {

    var data = {
      id: '123456789',
      displayName: 'Joe Joe',
      username: 'joejoejoe',
      profileUrl: 'https://github.com/joejoejoe',
      photos: [ { value: 'https://avatars3.githubusercontent.com/u/123456789?v=3' } ],
      provider: 'github'
    }

    service.updateGithubUser('', '', data)
    .then(function(user) {
      user.github.should.have.property('name', 'Joe Joe');
      user.github.should.have.property('id', '123456789');
      user.should.have.property('name', 'Joe Joe');
      done()
    })
  })

  it('should update github user', function test(done) {

    var data = {
      id: '123456789',
      displayName: 'Joe Joe 2',
      username: 'joejoejoe',
      profileUrl: 'https://github.com/joejoejoe',
      photos: [ { value: 'https://avatars3.githubusercontent.com/u/123456789?v=3' } ],
      provider: 'github'
    }

    service.updateGithubUser('', '', data)
    .then(function(user) {
      user.github.should.have.property('name', 'Joe Joe 2');
      user.github.should.have.property('id', '123456789');
      done()
    })
  })


  it('should register linkedin user', function test(done) {

    var data = {
      provider: 'linkedin',
      id: 'abcdefgh',
      displayName: 'Joe Novak',
      name: { familyName: 'Joe', givenName: 'Novak' },
      emails: [ { value: 'joe@mailinator.com' } ],
      _json: {
        emailAddress: 'joe@mailinator.com',
        firstName: 'Joe',
        headline: 'Windows 95 specialist',
        id: 'abcdefgh',
        pictureUrl: 'picture.jpg',
        lastName: 'Novak'
      }
    }


    service.updateLinkedinUser('', '', data)
    .then(function(user) {
      user.linkedin.should.have.property('name', 'Joe Novak');
      user.linkedin.should.have.property('id', 'abcdefgh');
      user.should.have.property('name', 'Joe Novak')
      user.should.have.property('picture', 'picture.jpg');
      done()
    })
  })

})
