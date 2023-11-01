import View from "./View.js";
// import iconsAnything from '../../img/icons.svg'; // Parcel 1
import iconsAnything from "url:../../img/icons.svg"; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe has been successfully uploaded Jordy 🕺🏾";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // this._parentElement
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();

// The line const data = [...new FormData(this)]; is creating an array named data that contains entries derived from the form element on which this line is executed. This line uses the FormData constructor to gather the form fields and values within a form.

// The FormData constructor can receive a form element as an argument. When new FormData(this) is used within a method of a form, it collects all the fields from that form. The ... spread operator in this context transforms the FormData object into an array of arrays containing pairs of field names and values.

// For instance, if you have a form like this:

// <form id="myForm">
//   <input type="text" name="name" value="John">
//   <input type="email" name="email" value="john@example.com">
// </form>

// Using const data = [...new FormData(document.getElementById('myForm'))]; would result in data being an array like this:

// [
//   ["name", "John"],
//   ["email", "john@example.com"]
// ]
// Each inner array contains a field name and its corresponding value from the form.
