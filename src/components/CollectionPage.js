import { css } from "@emotion/core";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import Search from "./Search";
import WithHeader from "./WithHeader";
import ErrorPage from "./ErrorPage";

const booklistCss = css`
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  list-style-type: none;
`;

const bookItemCss = css`
  background-color: var(--color-white);
  border-radius: var(--size-3);
  box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
  margin: var(--size-8);
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
    margin: var(--size-8) auto;
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
    font-size: var(--size-12);
  }
`;

const itemWrapCss = css`
  padding: var(--size-8);
`;

const actionCss = css`
  color: #c62828;
  font-size: var(--size-12);
  opacity: 0;
  padding: var(--size-8);
  position: absolute;
  right: 0;
  transition: 0.3s;
`;

const iconCss = css`
  width: 12px;
  height: 12px;
  margin-right: var(--size-4);
  vertical-align: baseline;
  fill: currentColor;
`;

export default function CollectionPage({
  userId,
  collection: currentUserCollection,
  currentUser,
}) {
  const [localSearchVal, setLocalSearchVal] = useState("");
  const [collection, setCollection] = useState([]);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const viewingOwnPage = userId === currentUser.uid;

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (viewingOwnPage) {
      setUser(currentUser);
      setUserLoading(false);
    } else {
      return firebase
        .firestore()
        .doc(`users/${userId}`)
        .onSnapshot(doc => {
          const foundUser = doc.data();
          setUser(foundUser);
          setUserLoading(false);
        });
    }
  }, [userId, currentUser]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (viewingOwnPage) {
      setCollection(currentUserCollection);
    } else {
      return firebase
        .firestore()
        .collection(`users/${userId}/books`)
        .onSnapshot(query => {
          const books = query.docs.map(doc => doc.data());
          setCollection(books);
        });
    }
  }, [userId, currentUserCollection]);

  return (
    <WithHeader>
      {!userLoading &&
        (user ? (
          <>
            <h1>{viewingOwnPage ? "My" : `${user.name}'s`} Collection</h1>
            <Search value={localSearchVal} onChange={setLocalSearchVal} />
            <ul css={booklistCss}>
              {collection
                .filter(book => {
                  const searchRegex = new RegExp(localSearchVal, "i");
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
                      {viewingOwnPage && (
                        <button
                          css={actionCss}
                          type="button"
                          onClick={() => {
                            firebase
                              .firestore()
                              .doc(`users/${user.uid}/books/${id}`)
                              .delete();
                          }}
                        >
                          <svg css={iconCss} viewBox="0 0 32 32">
                            <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z" />
                          </svg>
                        </button>
                      )}
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
          </>
        ) : (
          <ErrorPage />
        ))}
    </WithHeader>
  );
}

CollectionPage.propTypes = {
  userId: PropTypes.string,
  currentUser: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    photoUrl: PropTypes.string,
  }),
  collection: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      authors: PropTypes.arrayOf(PropTypes.string),
      thumbnail: PropTypes.string,
    }),
  ),
};

CollectionPage.defaultProps = {
  userId: undefined,
  currentUser: null,
  collection: [],
};
