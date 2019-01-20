import { css } from "@emotion/core";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Search from "./Search";

const booklistCss = css`
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  list-style-type: none;

  li {
    box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
    margin: 0.5rem;
    width: 200px;
    padding: 0.5rem;
  }

  img {
    object-fit: contain;
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    margin: 0.5rem auto;
    display: block;
  }

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  .title {
    font-size: 0.8rem;
    font-weight: bold;
  }

  .author {
    font-size: 0.75rem;
  }
`;

export default function MyCollectionPage({ collection }) {
  const [localSearchVal, setLocalSearchVal] = useState("");
  const [filteredCollection, setFilteredCollection] = useState(collection);
  return (
    <div>
      <h1>My Collection</h1>
      <Search
        value={localSearchVal}
        onChange={setLocalSearchVal}
        onSubmit={event => {
          event.preventDefault();
          const searchParam = new RegExp(localSearchVal.trim(), "i");
          const searchFields = ["title", "authors"];
          setFilteredCollection(
            collection.filter(book =>
              searchFields.some(searchField =>
                searchParam.test(book[searchField]),
              ),
            ),
          );
        }}
      />
      <ul css={booklistCss}>
        {filteredCollection
          .sort((a, b) =>
            a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
          )
          .map(book => {
            const { title, authors, id, thumbnail } = book;
            return (
              <li key={id}>
                <img src={thumbnail} alt={`${title} front cover`} />
                <div>
                  {title && (
                    <p className="title" title={title}>
                      {title}
                    </p>
                  )}
                  {authors && (
                    <p className="author" title={authors}>
                      {authors && authors.join(", ")}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

MyCollectionPage.propTypes = {
  collection: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      authors: PropTypes.arrayOf(PropTypes.string),
      thumbnail: PropTypes.string,
    }),
  ).isRequired,
};
