# nodejsResizeImgs
node.js resize images

This is a simple Microservice for resizing images with node.js using "sharp"

install

requirements:
- redis 
  - npm install redis
  - yum install redis
  - start redis: service redis start
- express
  - npm install express
- http
  - npm install http
- fs
  - npm install fs
- image-size
  - npm install image-size
- sharp
  - npm install sharp


usage:

- with new sizes:
  - http://your_server_ip:5555/images/1.jpg?size=300x400
  
- without sizes:
  - http://your_server_ip:5555/images/1.jpg
