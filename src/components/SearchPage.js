import { css } from "@emotion/core";
import axios from "axios";
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
    padding: 0.5rem 0.25rem;
    border-radius: 0.4rem;
    flex: 0 0 auto;
  }

  img {
    margin-right: 0.5rem;
    object-fit: contain;
    width: 100px;
    height: 100px;
    flex-shrink: 0;
  }

  span {
    display: block;
  }

  .title {
    font-size: 1rem;
    font-weight: 600;
  }

  .author {
    font-style: italic;
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

export default function SearchPage({ searchValue, setSearchValue }) {
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
              const snippet = {
                __html: idx(result, _ => _.searchInfo.textSnippet),
              };
              return (
                <li key={result.id}>
                  <img
                    src={idx(result, _ => _.volumeInfo.imageLinks.thumbnail)}
                    alt={`${title} front cover`}
                  />
                  <div>
                    {title && <span className="title">{title}</span>}
                    {authors && (
                      <span className="author">
                        {authors && authors.join(", ")}
                      </span>
                    )}
                    {snippet && <span dangerouslySetInnerHTML={snippet} />}
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
};
