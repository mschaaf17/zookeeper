const $animalForm = document.querySelector('#animal-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };
//in order to access the form to submit a new animal we need to fetch the api because it is not connected to the file itself rather it is on the server so we need to make the fetch request
//the fetch is slighltly different because we need to add information about the request
//since the request is coming from the server we only need to provide api./animals as the url
fetch('/api/animals', {
  //method is to specify what request it is-this will allow the request to make it to the proper endpoint in our server- this is the one we created in the previous lesson to add new animals to the JSON file
  method: 'POST',
  //headers to inform the request that this is going to be JSON data- we tell the request what type of data were looking to send and then acutally provide the data
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  //now we can use JSON.stringify for our animalObject to the body property of the request-- without these would we never receive req.body on the server
  body: JSON.stringify(animalObject)
})
.then(response => {
  if(response.ok) {
    return response.json()
  }
  alert('Error: ' + response.statusText)
})
.then(postResponse => {
  console.log(postResponse)
  alert('Thank you for adding an animal!')
})


};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
