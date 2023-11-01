class SearchView {
  _parentElement = document.querySelector(".search");
  _searchField = this._parentElement.querySelector(".search__field");

  getQuery() {
    return this._searchField.value;
    this._clearInput(); // Could have done it in addHandlerSearch() below
  }

  _clearInput() {
    this._searchField.value = "";
  }

  // Implementation of PUBLISHER-SUBSCRIBER DESIGN
  addHandlerSearch(handler) {
    // Hit submit button or hit enter key on form
    // 🔴 Leave responder as arrow function
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
      // this._clearInput(); // I did it in 'getQuery()'
    });
  }
}

export default new SearchView();
