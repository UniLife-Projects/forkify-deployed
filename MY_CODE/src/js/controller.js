import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js"; // we exported a 'new' class instance
import searchView from "./views/searchView.js"; // we exported a 'new' class instance
import resultsView from "./views/resultsView.js"; // we exported a 'new' class instance
import paginationView from "./views/paginationView.js"; // we exported a 'new' class instance
import bookmarksView from "./views/bookmarksView.js"; // we exported a 'new' class instance
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable"; // polyfill everything else
import "regenerator-runtime/runtime"; // polyfill async await
import { async } from "regenerator-runtime";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// From parcel
// if (module.hot) {
//   module.hot.accept();
// }

// SUBSCRIBER: code that wants to react
// Will subscribe to 'addHandlerRender()' in 'recipeView.js' through 'init()'
async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating Bookmarks View
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading Recipe
    await model.loadRecipe(id);

    // const { recipe } = model.state;
    // const recipe = model.state.recipe;

    // 3) Rendering the recipe
    recipeView.render(model.state.recipe); // 'recipeView' is an imported 'new' class

    // const recipeView = new RecipeView(model.state.recipe); // if we export entire class from 'recipeView.js' and import it here
  } catch (error) {
    console.error(`CONTROLLER.js controlRecipes():\n ${error}`);
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);

    // 1) GEt search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render Initial Pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(`CONTROLLER.JS controlSearchResults():\n${error}`);
  }
}

function controlPagination(goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  // 1) Add / Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update Recipe view
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    // Show loading Spinner
    addRecipeView.renderSpinner();

    console.log(Object.entries(newRecipe));
    console.log(newRecipe);

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render the just uploaded Recipe
    recipeView.render(model.state.recipe);

    // Display Success Message
    addRecipeView.renderMessage();

    // Render the Bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // window.history.back();

    // Close Form Window'
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(`CONTROLLER.js:\n ${error}`);
    addRecipeView.renderError(error.message);
  }
}

// Implementation of PUBLISHER-SUBSCRIBER DESIGN
function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
