//Offline data
db.enablePersistence()
  .catch(err => {
    if(err.code === 'failed-precondition'){
      //Probably multiple tabs opened at once
      console.log('Persistence Failed')
    } else if (err.code === 'unimplemented'){
      //No implemented in the browser
      console.log('Persistence is no available')
    }
  })

//Access a collection in firestore with a real-time listener
db.collection('recipies').onSnapshot((snapshot) => {
  // console.log(snapshot.docChanges())
  //Look at each change
  snapshot.docChanges().forEach(change => {
    // console.log(change, change.doc.data(), change.doc.id)
    if(change.type === 'added'){
      //Add document data to the web page to render it
      renderRecipe(change.doc.data(), change.doc.id)
    }
    if(change.type === 'removed'){
      //Delete the document from the web page
      removeRecipe(change.doc.id)
    }
  })
})

//Add a new recipe
const form = document.querySelector('.add-recipe')
//Add an event listener for submit
form.addEventListener('submit', evt => {
  evt.preventDefault() //Prevent browser reload
  /**Recipe to be added to firestore */
  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  }
  //Save the recipe as a document
  db.collection('recipies').add(recipe)
    .catch(err => { //Catch errors
      console.log(err)
    })
  //Reset form values
  form.title.value = ''
  form.ingredients.value = ''
})

/**Recipe wrapper*/
const recipeContainer = document.querySelector('.recipes')
recipeContainer.addEventListener('click', evt => {
  // console.log(evt)
  if(evt.target.tagName === 'I'){ //Only delete for iframes in the div
    /**Id of the recipe*/
    const id = evt.target.getAttribute('data-id')
    //Delete recipe
    db.collection('recipies')
    .doc(id).delete()
  }
})