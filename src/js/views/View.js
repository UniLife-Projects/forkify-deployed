// import iconsAnything from '../../img/icons.svg'; // Parcel 1
import iconsAnything from "url:../../img/icons.svg"; // Parcel 2

// Don't need instance of this Class elsewhere
export default class View {
  _data;

  /**
   *
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Jordy Uche 🕺🏾
   * @todo Finish Implementation
   */

  // https://jsdoc.app/
  // https://spoonacular.com/food-api

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll("*"));

    const currentElements = Array.from(
      this._parentElement.querySelectorAll("*")
    );

    // console.log(currentElements);
    // console.log(newElements);

    newElements.forEach(function (newElement, i) {
      const currentElement = currentElements[i];
      // console.log(currentElement, newElement.isEqualNode(currentElement));

      // Updates changed TEXT
      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ""
      ) {
        // console.log("", newElement.firstChild.nodeValue.trim());
        currentElement.textContent = newElement.textContent;
      }

      // Updates changed ATTRIBUTES
      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach((attribute) =>
          currentElement.setAttribute(attribute.name, attribute.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
            <div class="spinner">
              <svg>
                <use href="${iconsAnything}#icon-loader"></use>
              </svg>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
            <div class="error">
              <div>
                <svg>
                  <use href="${iconsAnything}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${iconsAnything}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

// This JavaScript code snippet is creating a new DocumentFragment, which is used to hold a collection of nodes. It does this by utilizing the createRange() method to create a new Range object, which can be used to define a portion of a document.
// document.createRange(): This creates a new Range object associated with the current document.
// In JavaScript, the Range object is used to represent a range of nodes within the DOM (Document Object Model). It provides a way to work with a portion of the document, making it possible to manipulate, select, and extract parts of the DOM. Ranges are particularly useful when dealing with selections, inserting content, and working with complex structures within a document. Ranges are often used in tasks that involve manipulating, selecting, or creating specific sections of content within the DOM. For instance, they are commonly used in rich text editors or when handling user text selections on a web page.
// createContextualFragment(newMarkup): This method, when invoked on the Range object, generates a new DocumentFragment by parsing the given string (newMarkup) as HTML. It's similar to using innerHTML on an element to create HTML content.

// A DocumentFragment in JavaScript is a minimal, lightweight Document object that serves as a container to hold DOM nodes (such as elements, text nodes, or other nodes) in memory without being part of the live DOM tree. It doesn't have a parent node, allowing it to store elements and nodes without being directly appended to the DOM. This makes it useful for batch appending of multiple nodes or creating new collections of elements before attaching them to the document.

// The DocumentFragment object has similar properties and methods as a standard Document, allowing for adding, removing, and manipulating elements, but it's not a full-fledged document and doesn't have some of the properties specific to a document (like documentElement). Instead, it provides a convenient way to perform batch operations on multiple nodes before inserting them into the live document.

// When you're ready to insert the fragment into the live DOM, you can append or insert the entire fragment into the DOM at the desired location. This process is efficient as it allows multiple elements to be inserted in one go, reducing the number of times the DOM is updated.

// For example, you might use a DocumentFragment when you need to build a complex set of nodes that are constructed in memory and then insert them into the live DOM in one operation, rather than appending each individual node one by one.

// In the given code snippet, document.createRange().createContextualFragment(newMarkup) creates a DocumentFragment from the provided markup in newMarkup, allowing you to select and manipulate the nodes contained within it before adding them to the live DOM.
