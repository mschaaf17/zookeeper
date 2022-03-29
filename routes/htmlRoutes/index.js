const path = require('path');
const router = require('express').Router();

//the / brings us to the route of the server--this isused to create a homepage for a server
//this is to respond with an html page to display in the browser res.sendfile is to tell them where to find the file we want our server to read and send back to the client
//path is used to find the correct location of the html code 
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})
//to get if this html page is working http://localhost:3001 in the browser after npm start
//to test this animals route http://localhost:3001/animals
router.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'))
})
router.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'))
})
//* wildcard routes in case a user makes a route that doesn't exist it would go back to the homepage
//this route should always come last
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})


//link to deployed file https://intense-dusk-76815.herokuapp.com/api/animals

module.exports = router
