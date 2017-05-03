
module.exports = {
	
	/**
	 * Save stats to redis
	**/
    saveHitsToRedis: function(statsType, callback){
        if(typeof(callback) == 'undefined'){
			callback = function(){};
		}

        module.exports.getStatsFromRedis(statsType, function(counts){
            //increment value
            cache.set(statsType, counts+1, redis.print);
        });
    },

    /**
	 * get stats from redis
	**/
    getStatsFromRedis: function(statsType, callback){
        if(typeof(callback) == 'undefined'){
			callback = function(){};
		}

        cache.get(statsType, function(err, counts) {
            if(err != null){
                callback(false);
            }

            callback(+counts > 0 ? +counts : 0);
        });
    },

    /**
	 * get stats from redis
	**/
    countFiles: function(dir){
        var shell = require('shelljs');
        return +shell.exec("ls -1 "+ dir +" | wc -l ", { silent:true }).stdout;
    },
    
    /**
	 * Verify if image is stored in redis
	**/
    imageExists: function(file, sizeW, sizeH, callback){
        if(typeof(callback) == 'undefined'){
			callback = function(){};
		}

       // console.log(':::::', typeof(sizeW), sizeW, typeof(sizeH), sizeH, (sizeW > 0 && sizeH > 0 ? sizeW + 'x' + sizeH + '_' : 'cucu'));

        //verify if it is stored in redis
        cache.get((sizeW > 0 && sizeH > 0 ? sizeW + 'x' + sizeH + '_' : '') + file, function(err, img) {
			//console.log('redis data:: ', err, img);
			if(err != null || img == 'false' || img == null){
				//image name doesn`t exists in redis
				callback(false);
				return;
			}else{
                //image name exists in redis
                callback(true);
                return;
            }
        });
    },

    /**
	 * Image resize
	**/
    resizeImage: function(file, sizeDim, callback){
        if(typeof(callback) == 'undefined'){
			callback = function(){};
		}

        sizeDim = sizeDim || false;

        var sizeDimm =  (typeof(sizeDim) != 'undefined' && sizeDim ? sizeDim.split('x') : [0,0]);

        //console.log(sizeDimm, typeof(sizeDimm[1]));

        //check if we have both width and height
        sizeDimm[0] = (typeof(sizeDimm[0]) != 'undefined' && +sizeDimm[0] > 0 ? sizeDimm[0] : 0);
        sizeDimm[1] = (typeof(sizeDimm[1]) != 'undefined' && +sizeDimm[1] > 0 ? sizeDimm[1] : 0);

        //console.log(sizeDimm, typeof(sizeDimm[1]));

        module.exports.imageExists(file, +sizeDimm[0], +sizeDimm[1], function(exists){
            if(!exists){
                //error - the image is not in redis
                console.log('image doesn`t exist in redis');

                //check if there is on the HDD
                if (fs.existsSync('.' + imagesFolder + file)) {
                    console.log('exists on hdd');
                   // cache.set('from_hdd', );

                    if(+sizeDimm[0] == 0 || +sizeDimm[1] == 0){ //if we don`t have W and H, returns original image
                        //save image name to redis
                        cache.set(file, 'true', redis.print);

                        console.log('incorrect image size. serving original image');

                        //save stats
                        module.exports.saveHitsToRedis('fromCache');

                        callback(false, imagesFolder + file, sizeDim);
                    }else{
                        sharp('.' + imagesFolder + file).resize(+sizeDimm[0], +sizeDimm[1]).toFile('.' + imagesResizedFolder + sizeDim + '_' + file, function(err) {
                        
                        //buffer
                        //sharp(imagesFolder + file).resize(+sizeDim[0], +sizeDim[1]).toBuffer('jpg', function(err, buffer) {
                            if (err) {
                                console.log('sharp processing error::');
                                throw err;
                            }
                            // containing a scaled and cropped version of input.jpg
                            console.log('image resized success');

                            //save image name to redis
                            cache.set(sizeDim + '_' + file, 'true', redis.print);

                            //save stats
                            module.exports.saveHitsToRedis('resized');

                            //file
                            callback(false, imagesResizedFolder + sizeDim + '_' + file, sizeDim);
                            
                            //buffer
                            //callback(false, buffer, sizeDim);
                        });
                    }
                    
                }else{
                    //image doesn`t exists on HDD
                    console.log('image doesn`t exists on hdd');
                    callback(true, '', sizeDim);
                }
            }else{
                //save stats
                module.exports.saveHitsToRedis('fromCache');

                //image exists in redis, also on hdd -> show it
                console.log('image exists in redis, also on hdd -> show it');
                callback(false, (+sizeDimm[0] == 0 || +sizeDimm[1] == 0 ? imagesFolder : imagesResizedFolder + sizeDim + '_') + file, sizeDim); 
            }
        });
    },

}
