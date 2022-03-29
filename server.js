//if after npm start the server has not reset do ctrl c and then y
//you can test things by putting in your http://localhost:3001/api/animals and then complete the query string

//need to be added to write the new animals into the json file from the POST request
// const fs = require('fs')
// const path = require('path')

const express = require('express')
//this is creating a route that the front-end can request data from
//its an object because animals as many differnt properties
//const { animals } = require('./data/animals')
const PORT = process.env.PORT || 3001;
const app = express()


//The require() statements will read the index.js files in each of the directories indicated. This mechanism works the same way as directory navigation does in a website: If we navigate to a directory that doesn't have an index.html file, then the contents are displayed in a directory listing. But if there's an index.html file, then it is read and its HTML is displayed instead. Similarly, with require(), the index.js file will be the default file read if no other file is provided, which is the coding method we're using here.
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

//this will intercept our POST request before it gets to the callback function since it won't be able to read it
//parse incoming string or array data
app.use(express.urlencoded({ extended: true }))
//parse incoming JSON data
app.use(express.json())
//if you have css and script files that are not showing when you load your html you need to create a route to use those files
//this needs to be placed near other app.use which is changed to app.use or it may not work--middlewear is express.static 11.3.4
app.use(express.static('public'))


//This is our way of telling the server that any time a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes. If / is the endpoint, then the router will serve back our HTML routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);


app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});