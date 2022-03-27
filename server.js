//if after npm start the server has not reset do ctrl c and then y
//you can test things by putting in your http://localhost:3001/api/animals and then complete the query string

//need to be added to write the new animals into the json file from the POST request
const fs = require('fs')
const path = require('path')

const express = require('express')
//this is creating a route that the front-end can request data from
//its an object because animals as many differnt properties
const { animals } = require('./data/animals')
const PORT = process.env.PORT || 3001;
const app = express()
//this will intercept our POST request before it gets to the callback function since it won't be able to read it
//parse incoming string or array data
app.use(express.urlencoded({ extended: true }))
//parse incoming JSON data
app.use(express.json())

//if you have css and script files that are not showing when you load your html you need to create a route to use those files
//this needs to be placed near other app.use or it may not work--middlewear is express.static 11.3.4
app.use(express.static('public'))

//this function should take req.query as an argument and filter through the animals, returning the new filtered array
//this will be called in the app.get() function
function filterByQuery(query, animalsArray){
    //allow users to request personality traits because they are in an array
    let personalityTraitsArray = [];
    //note that we save teh animalsArray as filtered results here:
    let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
      //now you can run a personalityTrait as a query string and all animals with that trait will display http://localhost:3001/api/animals?personalityTraits=goofy
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  // return the filtered results:
  return filteredResults;
}


//this shows a single animal at the index of 1 due to the query of id 
//http://localhost:3001/api/animals/1
function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id) [0];
  return result
}

//this function will accept the POST routes req.body value and the array we want to add data to which will be animalsArray since the function is for adding a new animal to the catalog
function createNewAnimal(body, animalsArray) {
//  console.log(body)
  const animal = body
  animalsArray.push(animal)
  //write to save into the animals.json file
  //sync does not require a callback if the data set was larger use async
  //we are writing out animals.json file in the data subdirectory so we use the method path.join() to join the value of __dirname, which represents the directory of the file we execute the code in, which the path to the animals.json file
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    //this is to save the javascript array data as json, null and 2 means of keeping out data formatted 
    //null means we dont want to edit any of our exciting data, 2 we want to create white space between out values to make them more readable
    //leave out null or 2 it will just be hard to read
    JSON.stringify({ animals: animalsArray }, null, 2)
  )
  //return finished code to post route for response we will change return body to return animal since we have a const
  //when we POST a new animal we will add it to the imported animals array from the animals.json file
  return animal;
}

//this is going to take our new animal data from req.body and check if each key not only exitst but that it also the right type of data
//after this function we need to make sure the POST routes callback is checking this before creating the data
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}



//gets are your routes for user to get access to the json file
//adding the route-get requires 2 arugments-1st string that describes the route the client wil have to fetch from, the second is the clalback function that will execute every time the route is accessed with a GET request
app.get('/api/animals', (req, res) => {
//     //we are using send() method from res parameter(short for response) to send the string hello to our client
//     //instead of send we can use json to send more information like we see in api's -- we will grab the animals data this way
//     res.json(animals)
    //we want to request only some of the animals
    let results = animals;

    //call back for the filterByQuery()
    //if we run http://localhost:3001/api/animals?name=Erica after npm start then we will only see the information about the gorilla erica
    //you can change the query string to a differnt name and new information will show such as noel
    if (req.query) {
        results = filterByQuery(req.query, results)
    }
    console.log(req.query)
    res.json(results)
    // get out this link http://localhost:3001/api/animals?name=Erica then running npm start you will see Erica in the console because the req.query was this query string ?name=Erica was added to the url as a query string
})

//this req objects gives you access to the paramas -- the param object need to be define in the route path with <route>/:<parameterName>
//this creates a new GET route for animals so with :id is added to the query
//the order of these routes are important the param route must come after the other GET route. You may have already noticed that theres a function called findById() int eh callback similar to filterByQuery() expect this time were passing req.params.id you could use query filter but since we are only returning a single animal id is unique--this is shorter option
app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  //this will display the correct page other a 404 message if the link is not right
  if (result) {
  res.json(result)
  } else {
    res.sendStatus(404)
  }
})

//this is defining a route that listens to the POST request got GET requests-- POST differt from GET in that they represent the action of a client requesting the server to accept data rather than vice versa
//this just allows us to accept the request 
app.post('/api/animals', (req, res) => {
  //this will be seeting up the post request
  //req.body is where our incoming content will be-- POST we can package up data, typically as an object, and send it to the server
  //req.body is where we can access that data on the server side and do something with it. 
  //console.log will view the data were posting to the server and then res.json to send the data back to the client
  console.log(req.body)
  //set id based on what the next index of the array will be
  //test this in insomnia 
  req.body.id = animals.length.toString()

  //validation check from function
  //if any data in req.body is inccorect, send 400 error back
  if (!validateAnimal(req.body)) {
    //resstatussend is a reponse method to relay a message to the client making a request 404 means user error not server error
    res.status(400).send('This animal is no properly formatted.')
  } else {
  //add animal to json file and animals array in this function
  //once we add this const we are change res.json(req.body) to res.json(animal)
  //the const animal now has req.body as well as animals
  const animal = createNewAnimal(req.body, animals)
    res.json(animal)
  }
  })

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

//the / brings us to the route of the server--this isused to create a homepage for a server
//this is to respond with an html page to display in the browser res.sendfile is to tell them where to find the file we want our server to read and send back to the client
//path is used to find the correct location of the html code 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})
//to get if this html page is working http://localhost:3001 in the browser after npm start



//link to deployed file https://intense-dusk-76815.herokuapp.com/api/animals