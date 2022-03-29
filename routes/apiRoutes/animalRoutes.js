//we are using app which is not a const in this file so we need to add this
//so we will use the const router since app was used in server.js
const router = require('express').Router()
//../ is one level higher, so ../../ is two levels higher.
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');



//gets are your routes for user to get access to the json file
//adding the route-get requires 2 arugments-1st string that describes the route the client wil have to fetch from, the second is the clalback function that will execute every time the route is accessed with a GET request
//if these routes were in the server.js we would need ('./api/animas', (req, res))
router.get('/animals', (req, res) => {
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
    router.get('/animals/:id', (req, res) => {
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
router.post('/animals', (req, res) => {
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
  

    module.exports = router