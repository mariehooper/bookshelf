import { css } from "@emotion/core";
import PropTypes from "prop-types";
import React, { useState } from "react";
import firebase from "firebase/app";
import Search from "./Search";
import WithHeader from "./WithHeader";

const booklistCss = css`
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  list-style-type: none;
`;

const bookItemCss = css`
  background-color: var(--color-white);
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
  margin: 0.5rem;
  width: 200px;
  position: relative;

  &:hover,
  :focus {
    button {
      opacity: 1;
    }
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
  }

  .title {
    font-size: 0.8rem;
    font-weight: bold;
  }

  .author {
    font-size: 0.75rem;
  }
`;

const itemWrapCss = css`
  padding: 0.5rem;
`;

const actionCss = css`
  color: #c62828;
  font-size: var(--size-12);
  opacity: 0;
  padding: 0.5rem;
  position: absolute;
  right: 0;
  transition: 0.3s;
`;

const iconCss = css`
  width: 12px;
  height: 12px;
  margin-right: 0.25rem;
  vertical-align: baseline;
  fill: currentColor;
`;

export default function MyCollectionPage({ collection, currentUser }) {
  const [localSearchVal, setLocalSearchVal] = useState("");
  const [searchParam, setSearchParam] = useState("");
  return (
    <WithHeader>
      <h1>My Collection</h1>
      <Search
        value={localSearchVal}
        onChange={setLocalSearchVal}
        onSubmit={event => {
          event.preventDefault();
          setSearchParam(localSearchVal.trim());
        }}
      />
      <ul css={booklistCss}>
        {collection
          .filter(book => {
            const searchRegex = new RegExp(searchParam, "i");
            return (
              searchRegex.test(book.title) ||
              book.authors.some(author => searchRegex.test(author))
            );
          })
          .sort((a, b) =>
            a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
          )
          .map(book => {
            const { title, authors, id, thumbnail } = book;
            return (
              <li css={bookItemCss} key={id}>
                <button
                  css={actionCss}
                  type="button"
                  onClick={() => {
                    firebase
                      .firestore()
                      .doc(`users/${currentUser.uid}/books/${id}`)
                      .delete();
                  }}
                >
                  <svg css={iconCss} viewBox="0 0 32 32">
                    <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z" />
                  </svg>
                </button>
                <div css={itemWrapCss}>
                  <img src={thumbnail} alt={`${title} front cover`} />
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
    </WithHeader>
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
  currentUser: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    photoUrl: PropTypes.string,
  }),
};

MyCollectionPage.defaultProps = { currentUser: null };
