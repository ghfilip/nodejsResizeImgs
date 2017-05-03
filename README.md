# nodejsResizeImgs
node.js resize images

This is a simple Microservice for resizing images with node.js using "sharp"

install

requirements:
- redis 
<pre>
  npm install redis
  yum install redis
  start redis: service redis start
</pre>
- express
<pre>
  npm install express
</pre>
- http
<pre>
  npm install http
</pre>
- fs
<pre>
  npm install fs
</pre>
- image-size
<pre>
  npm install image-size
</pre>
- sharp
<pre>
  npm install sharp
</pre>
- shelljs
<pre>
  npm install shelljs
</pre>


usage:

- return image with new sizes (resized):
<pre>
  http://your_server_ip:5555/images/1.jpg?size=300x400
</pre>
  
- return image without sizes (original image):
<pre>
  http://your_server_ip:5555/images/1.jpg
</pre>
  
- stats page:
<pre>
  http://your_server_ip:5555/stats
</pre>
  


unit testing:

requirements:
- sinon
<pre>
  npm install sinon
</pre>
- chai
<pre>
  npm install chai
</pre>
- sinon-chai
<pre>
  npm install sinon-chai
</pre>
  
running tests:
<pre>
  mocha ./lib/unit.js
</pre>
   
