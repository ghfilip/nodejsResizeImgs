
module.exports = {
	
	/**
	 * incarca imaginile din director
	**/

    /*getImages: function(callback){
        if(typeof(callback) == 'undefined'){
			callback = function(){};
		}

        fs.readdir('.'+imagesFolder, function(err, files){
            console.log(files);

           // images[file] = {};
            //images[file].size = 'original';
            
            files.forEach(function(file){
                //get images initial size
                sizeOf('.'+imagesFolder+'/'+file, function (err, dimensions) {
                    //if it not exists in the array
                    if(typeof(images[file]) == 'undefined'){
                        images[file] = {};
                    }
                    images[file].size = dimensions.width+'x'+dimensions.height;
                    console.log(file, dimensions.width, dimensions.height);
                });
               
                //images[file] = {};
                //images[file].size = 'original';
            });
            //console.log(images);
        });
    },*/

    //loads only one image in the images array
    /*getOneImage: function(file){
         images[file] = {};
         var dimensions = sizeOf('.'+imagesFolder+'/'+file);
         images[file].size = dimensions.width+'x'+dimensions.height;
         console.log('loaded image: ', file, dimensions.width, dimensions.height);

         return true;
    },*/

    imageExists: function(file, sizeDim, callback){
        if(typeof(callback) == 'undefined'){
			callback = function(){};
		}

        //verificam in Redis daca exista
        cache.get(sizeDim + '_' + file, function(err, img) {
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


       /* console.log(file, images);
        if(typeof(images[file]) == 'undefined'){
            //verificam daca exista pe server
            if (fs.existsSync(imagesFolder + '/' + file)) {
                console.log('imaginea exista, dar nu e incarcata');
                //incarcam imaginea in array (probabil s-au adaugat imagini noi)
               if(module.exports.getOneImage(file)){
                   return true;
               }
            }else{
                //imaginea nu exista pe server. return nothing
                console.log('imaginea nu exista pe server');
                return false;
            }
            //imaginea nu exista => reincarcam imaginile
            // nu cred ca e necesar sa incarcam degeaba array-ul..
            //module.exports.getImages();
        }
        return true;
        */
    },

    /*searchImageSize: function(file, sizeDim){
        //daca exista
        if(typeof(images[file]) != 'undefined' && typeof(images[file].size[sizeDim]) != 'undefined'){
            return true;
        }
        return false;
    },*/

    resizeImage: function(file, sizeDim, callback){
        if(typeof(callback) == 'undefined'){
			callback = function(){};
		}

        var sizeDimm =  sizeDim.split('x');

        module.exports.imageExists(file, sizeDim, function(exists){
            if(!exists){
                //eroare - imaginea nu exista in redis
                //ii facem resize daca exista pe hdd
                console.log('nu exista in redis');
                if (fs.existsSync('.'+imagesFolder + '/' + file)) {
                    console.log('exista pe hdd');
                    sharp('.'+imagesFolder + '/' + file).resize(+sizeDimm[0], +sizeDimm[1]).toFile('.'+imagesResizedFolder + '/' + sizeDim + '_' + file, function(err) {
                    //sharp(imagesFolder + '/' + file).resize(+sizeDim[0], +sizeDim[1]).toBuffer('jpg', function(err, buffer) {
                        if (err) {
                            console.log('eroare sharp::');
                            throw err;
                        }
                        // containing a scaled and cropped version of input.jpg
                        console.log('am redimensionat foto');

                        //salvam existenta imaginii in redis
                        cache.set(sizeDim + '_' + file, 'true', redis.print);

                        //file
                        callback(false, imagesResizedFolder + '/' + sizeDim + '_' + file, sizeDim);
                        
                        //buffer
                        //callback(false, buffer, sizeDim);
                    });
                }else{
                    //imaginea nu exista pe hdd
                     console.log('nu exista pe hdd');
                    callback(true, '', sizeDim);
                }
            }else{
                //imaginea exista in redis, deci si pe hdd -> o servim
                 console.log('exista in redis -> servim direct');
                 callback(false, imagesResizedFolder + '/' + sizeDim + '_' + file, sizeDim);
            }
        });
    },

}