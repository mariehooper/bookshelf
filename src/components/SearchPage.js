import { css } from "@emotion/core";
import axios from "axios";
import firebase from "firebase/app";
import idx from "idx";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import Search from "./Search";

const searchResultCss = css`
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;

  li {
    list-style-type: none;
    display: flex;
    align-items: flex-start;
    margin: 0.5rem;
    width: 48%;
    box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
    background-color: white;
    padding: 0.25rem;
    border-radius: 0.4rem;
    flex: 0 0 auto;
  }

  img {
    margin-right: 0.5rem;
    object-fit: contain;
    width: 120px;
    height: 120px;
    flex-shrink: 0;
  }

  span {
    display: block;
  }

  .search-result {
    flex: 1;
  }

  .title {
    font-size: 1rem;
    font-weight: 600;
    /* stylelint-disable-next-line value-no-vendor-prefix */
    display: -webkit-box;
    -webkit-line-clamp: 1;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .author {
    font-style: italic;
  }

  .description {
    /* stylelint-disable-next-line value-no-vendor-prefix */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 60px;
  }

  button,
  .in-collection {
    margin-left: auto;
    display: block;
    padding: 0.25rem 0.5rem;
    color: #7f47cb;
  }

  .add-outline,
  .checkmark {
    width: 10px;
    height: 10px;
    margin-right: 0.25rem;
    vertical-align: baseline;
    fill: currentColor;
  }

  .in-collection {
    color: #47c34c;
    text-align: right;
  }
`;

const buttonCss = css`
  white-space: nowrap;
  display: block;
  height: 40px;
  line-height: 40px;
  padding: 0 14px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  background: #fff;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: var(--color-blue);
  text-decoration: none;
  transition: all 0.15s ease;
  margin: 0 auto;
`;

export default function SearchPage({
  searchValue,
  setSearchValue,
  collection,
  currentUser,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const resultIds = useRef({});

  async function queryBooks() {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        searchValue,
      )}`,
    );
    setSearchResults(response.data.items);
    response.data.items.forEach(item => {
      resultIds.current[item.id] = true;
    });
  }

  useEffect(() => {
    if (searchValue.trim()) {
      queryBooks();
    }
  }, []);

  return (
    <React.Fragment>
      <h1>Search Books</h1>
      <Search
        value={searchValue}
        onChange={setSearchValue}
        onSubmit={event => {
          event.preventDefault();
          queryBooks();
        }}
      />
      {searchResults.length > 0 && (
        <React.Fragment>
          <ul css={searchResultCss}>
            {searchResults.map(result => {
              const authors = idx(result, _ => _.volumeInfo.authors);
              const title = idx(result, _ => _.volumeInfo.title);
              const thumbnail = idx(
                result,
                _ => _.volumeInfo.imageLinks.thumbnail,
              );
              const snippet = {
                __html: idx(result, _ => _.searchInfo.textSnippet),
              };
              return (
                <li key={result.id}>
                  <img src={thumbnail} alt={`${title} front cover`} />
                  <div className="search-result">
                    {title && <span className="title">{title}</span>}
                    {authors && (
                      <span className="author">
                        {authors && authors.join(", ")}
                      </span>
                    )}
                    {snippet && (
                      <span
                        className="description"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={snippet}
                      />
                    )}
                    {currentUser && (
                      <React.Fragment>
                        {!collection.find(book => book.id === result.id) ? (
                          <button
                            type="button"
                            onClick={() => {
                              firebase
                                .firestore()
                                .doc(
                                  `users/${currentUser.uid}/books/${result.id}`,
                                )
                                .set({
                                  id: result.id,
                                  title,
                                  authors,
                                  thumbnail,
                                });
                            }}
                          >
                            <svg className="add-outline" viewBox="0 0 32 32">
                              <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z" />
                            </svg>
                            Add to collection
                          </button>
                        ) : (
                          <p className="in-collection">
                            <svg className="checkmark" viewBox="0 0 32 32">
                              <path d="M27 4l-15 15-7-7-5 5 12 12 20-20z" />
                            </svg>
                            Added to collection
                          </p>
                        )}
                      </React.Fragment>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            css={buttonCss}
            onClick={async () => {
              const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                  searchValue,
                )}&startIndex=${searchResults.length}`,
              );
              const nextResults = response.data.items.filter(
                item => !resultIds.current[item.id],
              );
              setSearchResults([...searchResults, ...nextResults]);
              nextResults.forEach(item => {
                resultIds.current[item.id] = true;
              });
            }}
          >
            Load More
          </button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

SearchPage.propTypes = {
  setSearchValue: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  collection: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      authors: PropTypes.arrayOf(PropTypes.string),
      thumbnail: PropTypes.string,
    }),
  ).isRequired,
  currentUser: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    photoUrl: PropTypes.string,
  }),
};

SearchPage.defaultProps = { currentUser: null };
