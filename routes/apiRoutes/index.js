//Here we're employing Router as before, but this time we're having it use the module exported from animalRoutes.js. (Note that the .js extension is implied when supplying file names in require()).
const router = require('express').Router();
//The require() statements will read the index.js files in each of the directories indicated.
// const apiRoutes = require('./routes/apiRoutes');
// const htmlRoutes = require('./routes/htmlRoutes');


const animalRoutes = require('../apiRoutes/animalRoutes');

//using the module exported from animalRoutes.js
router.use(animalRoutes);

module.exports = router;