const fs = require("fs");
const path = require("path");

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
  //these functions wer moved from server to animals os they need ../data for the path 
  fs.writeFileSync(
    path.join(__dirname, '../data/animals.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
  };