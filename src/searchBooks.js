import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Book from './book'
import * as BooksAPI from './BooksAPI'
// import escapeStringRegexp from 'escape-string-regexp'


class SearchBooks extends Component {
  state = {
    query: "",
    foundBooks: [],
  }

  handleChange = (value) => {
    this.setState({
      query: value,
    }, () => {
      this.renderBooks()
    });
  }

  renderBooks = () => {
    BooksAPI.search(this.state.query).then((data) => {
      if(!data || data.hasOwnProperty("error")) {
        this.setState({foundBooks: []})
      } else {
        this.setState({foundBooks: data})
      }
    })
  }

  onRefresh = (data, id, shelf) => {
    BooksAPI.update(data, shelf).then(
      this.props.onRefresh()
    )
  }

  render() {
    const {query, foundBooks} = this.state
    let template = [];

    for(let book in foundBooks) {

        let bookObject = foundBooks[book]

        foundBooks[book].hasOwnProperty("shelf") ?
        bookObject["shelf"] = foundBooks[book].shelf :
        bookObject["shelf"] = "none"

        template.push(
        <li key = { foundBooks[book].id }>
          <Book
            bookObject= { bookObject }
            onRefresh= { this.onRefresh }/>
        </li>)
    }

    console.log("searchBooks.js rendered")
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/" onClick= { this.props.onRefresh }> Close </Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input type="text"
              placeholder="Search by title or author"
              value={query}
              onChange={ (e) => {this.handleChange(e.target.value)} }/>

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            { template }
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchBooks
