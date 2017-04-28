
module.exports = {
	
	/**
	 * Verify if image is stored in redis
	**/
    imageExists: function(file, sizeW, sizeH, callback){
        if(typeof(callback) == 'undefined'){
			callback = function(){};
		}

        //verify if it is stored in redis
        cache.get((sizeW && sizeH ? sizeW + 'x' + sizeH + '_' : '') + file, function(err, img) {
			console.log('redis data:: ', err, img);
			if(err != null || img == null){
				//imaginea nu exista
				callback(false);
				return;
			}

            //imaginea exista
            callback(true);
            return;
        });
    },

    /**
	 * Image resize
	**/
    resizeImage: function(file, sizeDim, callback){
        if(typeof(callback) == 'undefined'){
			callback = function(){};
		}

        var sizeDimm =  sizeDim.split('x');

        module.exports.imageExists(file, +sizeDimm[0], +sizeDimm[1], function(exists){
            if(!exists){
                //error - the image is not in redis
                console.log('image doesn`t exist in redis');

                //check if there is on the HDD
                if (fs.existsSync('.'+imagesFolder + '/' + file)) {
                    console.log('exists on hdd');

                    if(!+sizeDimm[0] > 0 && !+sizeDimm[1] > 0){ //if we don`t have W and H, returns original image
                        //save image name to redis
                        cache.set(file, 'true', redis.print);

                        callback(false, imagesFolder + '/' + file, sizeDim);
                    }else{
                        sharp('.'+imagesFolder + '/' + file).resize(+sizeDimm[0], +sizeDimm[1]).toFile('.'+imagesResizedFolder + '/' + sizeDim + '_' + file, function(err) {
                        
                        //buffer
                        //sharp(imagesFolder + '/' + file).resize(+sizeDim[0], +sizeDim[1]).toBuffer('jpg', function(err, buffer) {
                            if (err) {
                                console.log('eroare sharp::');
                                throw err;
                            }
                            // containing a scaled and cropped version of input.jpg
                            console.log('am redimensionat foto');

                            //save image name to redis
                            cache.set(sizeDim + '_' + file, 'true', redis.print);

                            //file
                            callback(false, imagesResizedFolder + '/' + sizeDim + '_' + file, sizeDim);
                            
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
                //image exists in redis, also on hdd -> show it
                 console.log('image exists in redis, also on hdd -> show it');
                 callback(false, (!+sizeDimm[0] > 0 && !+sizeDimm[1] > 0 ? imagesFolder + '/' + sizeDim : imagesResizedFolder + '/' + sizeDim + '_') + file, sizeDim);
            }
        });
    },

}
