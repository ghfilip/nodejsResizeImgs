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

global.imagesFolder = '/images/';
global.imagesResizedFolder = '/images_resized/';

//add the logic
var imgs = require("./lib/functions.js");

app.use(express.static(__dirname + '/images'));

//stats
app.get('/stats/', function(req, res){
    console.log('stats accessed::');
    imgs.getStatsFromRedis('fromCache', function(counts){
        imgs.getStatsFromRedis('resized', function(counts2){
            res.send('Images stats:<br /><br />Total images: '+ imgs.countFiles(__dirname + imagesFolder) +'<br />Resized images: '
                + imgs.countFiles(__dirname + imagesResizedFolder) +'<br />Served from cache: '+ counts +'<br />Images resized: '+ counts2);
        });
    });
});

//images
app.get('/images/:imgName', function (req, res) {
    console.log(req.params, req.query); //
        
    imgs.resizeImage(req.params.imgName, req.query.size, function(err, file, sizeDim){
        if(err) console.log('resize error');

        //from file
        res.sendFile(__dirname + file);
        
        //from buffer
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
