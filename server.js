//if after npm start the server has not reset do ctrl c and then y

const express = require('express')
//this is creating a route that the front-end can request data from
//its an object because animals as many differnt properties
const { animals } = require('./data/animals')
const PORT = process.env.PORT || 3001;
const app = express()

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

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

//link to deployed file https://intense-dusk-76815.herokuapp.com/api/animals