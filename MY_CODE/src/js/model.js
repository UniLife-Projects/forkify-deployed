import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
// import { getJSON, sendJSON } from "./helpers.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    // id: data.data.recipe.id,
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (error) {
    // Temporary Error handling technic
    // alert(`Error in loadRecipe in model.js: ${error}`);
    console.error(`MODEL.js loadRecipe(): ${error}`);
    // Permanent Error handling technic
    throw error;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(function (item) {
      return {
        id: item.id,
        title: item.title,
        publisher: item.publisher,
        image: item.image_url,
        ...(item.key && { key: item.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    // Temporary Error handling technic
    // alert(`Error in loadRecipe in model.js: ${err}`);
    console.error(`MODEL.js loadRecipe(): ${error}`);
    // Permanent Error handling technic
    throw error;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(function (ing) {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = (oldQt * newServings) / oldServings
    // (2 * 8) / 4 = 4

    state.recipe.servings = newServings;
  });
}

function persistBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
}

export function deleteBookmark(id) {
  // Delete Bookmark
  const index = state.bookmarks.findIndex((element) => element.id === id);

  state.bookmarks.splice(index, 1);
  // splice(start, deleteCount, item1)

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
}

// Retrieve Bookmarks
function init() {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
}

init();
// console.log(state.bookmarks);

// Function for debugging
function clearBookmarks() {
  localStorage.clear("bookmarks");
}
// clearBookmarks();

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ingredient) => {
        const ingredientsArr = ingredient[1]
          .split(",")
          .map((element) => element.trim());
        // const ingredientsArr = ingredient[1].replaceAll(" ", "").split(",");

        if (ingredientsArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format :)"
          );

        const [quantity, unit, description] = ingredientsArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}
// API-KEY: d4ec2910-6d33-4b66-a55c-4f889ed92199
