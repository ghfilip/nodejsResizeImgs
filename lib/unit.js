
global.redis = require('redis');
global.cache = redis.createClient(); //creates a new client



var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');

global.fs = require("fs");
global.sizeOf = require('image-size');
global.sharp = require('sharp');

global.imagesFolder = '/images/';
global.imagesResizedFolder = '/images_resized/';

before(function () {
  chai.use(sinonChai);
});

beforeEach(function () {  
  this.sandbox = sinon.sandbox.create();
});

afterEach(function () {  
  this.sandbox.restore();
});

var expect = require('chai').expect;


//test///

var imgs = require("./functions.js");

//test imageExists function
describe('Check if image name exists in redis', function () {
  it('running imageExists function', function(done) {
    var file = '1.jpg'; 
    var sizeW = 300;
    var sizeH = 600;

    imgs.imageExists(file, sizeW, sizeH, function(exists){
		expect(exists).to.equal(true);
		done();
	});
  });
});


//test imageExists function
describe('Check image resize', function () {
  it('running resizeImage function for "1.jpg" with "300x600"', function(done) {
    var file = '1.jpg';
    var size = '300x600';

    imgs.resizeImage(file, size, function(err, imgStr, dim){
		expect(err).to.equal(false);
		expect(imgStr).to.equal(imagesResizedFolder + '300x600_1.jpg');
		expect(dim).to.equal(size);
		done();
	});
  });
});


//test imageExists function
describe('Check image resize', function () {
  it('running resizeImage function for "2.jpg"with "300x"', function(done) {
    var file = '2.jpg';
    var size = '300x';

    imgs.resizeImage(file, size, function(err, imgStr, dim){
		expect(err).to.equal(false);
		expect(imgStr).to.equal(imagesFolder + '2.jpg');
		expect(dim).to.equal(size);
		done();
	});
  });
});

//test imageExists function
describe('Check image resize', function () {
  it('running resizeImage function for "3.jpg" with ""', function(done) {
    var file = '3.jpg';
    var size = '';

    imgs.resizeImage(file, size, function(err, imgStr, dim){
		expect(err).to.equal(false);
		expect(imgStr).to.equal(imagesFolder + '3.jpg');
		expect(dim).to.equal(false);
		done();
	});
  });
});


//test countFiles function
describe('Check countFiles', function () {
  it('running countFiles function for "imagesFolder"', function(done) {

    var number = imgs.countFiles(imagesFolder);
	expect(number).to.be.a('number');
	done();
  });
});


//test countFiles function
describe('Check countFiles', function () {
  it('running countFiles function for "imagesResizedFolder"', function(done) {

    var number = imgs.countFiles(imagesResizedFolder);
	expect(number).to.be.a('number');
	done();
  });
});


//test getStatsFromRedis function
describe('Check getStatsFromRedis', function () {
  it('running getStatsFromRedis function for "fromCache" variable', function(done) {
	var variable = 'fromCache';
    imgs.getStatsFromRedis(variable, function(count){
		expect(count).to.be.above(1);
		done();
	});
  });
});


//test getStatsFromRedis function
describe('Check getStatsFromRedis', function () {
  it('running getStatsFromRedis function for "resized" variable', function(done) {
	var variable = 'resized';
    imgs.getStatsFromRedis(variable, function(count){
		expect(count).to.be.above(1);
		done();
	});
  });
});



