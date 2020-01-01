/**Recipes div*/
const recipes = document.querySelector('.recipes')

/**Event for when the DOM is completely loaded */
document.addEventListener('DOMContentLoaded', function() {
  /**Query for the class="side-menu" DOM element*/
  const menus = document.querySelectorAll('.side-menu');
  //Materialize init for a sidenave from the right
  M.Sidenav.init(menus, {edge: 'right'});
  /**Query for the class="side-form" DOM element*/
  const forms = document.querySelectorAll('.side-form');
  //Materialize init for a sidenave from the left
  M.Sidenav.init(forms, {edge: 'left'});
})

/**
 * Render a recipe data in the DOM
 * @param {Object} data Recipe data from firestore
 * @param {String} id UID of the recipe
 */
const renderRecipe = (data, id) => {
  /**html template for the recipe*/
  const html = `
    <div class="card-panel recipe white row" data-id="${id}">
      <img src="/img/dish.png" alt="recipe thumb">
      <div class="recipe-details">
        <div class="recipe-title">${data.title}</div>
        <div class="recipe-ingredients">${data.ingredients}</div>
      </div>
      <div class="recipe-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
    </div>
  `;

  //Add to the recipes div the template for the recipe
  recipes.innerHTML += html
}

/**
 * Removes a recipe from the DOM
 * @param {String} id id of the recipe
 */
const removeRecipe = (id) => {
  //Search the DOM for a recipe with the passed id
  const recipe = document.querySelector(`.recipe[data-id=${id}]`)
  //Remove element from the DOM
  recipe.remove()
}