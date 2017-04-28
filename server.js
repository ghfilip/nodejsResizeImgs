global.redis = require('redis');
global.cache = redis.createClient(); //creates a new client

cache.on('connect', function() {
    console.log('Connected to Redis');
});


var express = require('express');
var app = express();
var http = require('http').Server(app);

global.fs = require("fs");
global.sizeOf = require('image-size');
global.sharp = require('sharp');

//variabila cu imaginile disponibile
global.imagesFolder = '/images/';
global.imagesResizedFolder = '/images_resized/';

//add the auctions
var imgs = require("./lib/functions.js");

app.use(express.static(__dirname + '/images'));

app.get('/images/:imgName', function (req, res) {
    console.log("intra aici");
    console.log(req.params, req.query); //
        
    imgs.resizeImage(req.params.imgName, req.query.size, function(err, file, sizeDim){
        if(err) console.log('eroare la resize');

        //servim imaginea cu resize facut
        
        //din fisier
        res.sendFile(__dirname + file);
        
        //din buffer
        //res.writeHead(200, {'Content-Type': 'image/jpeg' });
        // res.end(file);
    });
})

http.listen(5555 , function(){
	console.log('listening on :5555 port');
});


process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log("\n\n==================ERROR=======================", err, "\n==============end eror======================");
	
	var dt = new Date();
	var Y = dt.getFullYear(), m = dt.getMonth()+1, d = dt.getDate(), h = dt.getHours(), i = dt.getMinutes(), s = dt.getSeconds(), ms = dt.getMilliseconds();
	m = (m < 10 ? '0'+ m.toString() : m);
	d = (d < 10 ? '0'+ d.toString() : d);
	h = (h < 10 ? '0'+ h.toString() : h);
	i = (i < 10 ? '0'+ i.toString() : i);
	s = (s < 10 ? '0'+ s.toString() : s);
	var date = (Y +'-'+ m +'-'+ d +' '+ h +':'+ i +':'+ s );
	
	console.log('err::', err);
});