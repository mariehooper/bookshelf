import { css, Global } from "@emotion/core";
import { Router } from "@reach/router";
import firebase from "firebase/app";
import React, { useEffect, useState } from "react";
import Context from "./Context";
import HomePage from "./HomePage";
import MyCollectionPage from "./MyCollectionPage";
import SearchPage from "./SearchPage";

const globalStyles = css`
  :root {
    --color-blue: #243b55;
    --color-dark-blue: #141e30;
    --color-white: #fff;
    --color-light-gray: #fbfbfb;
    --color-blue-gray: #eceff1;
    --color-gray: #757575;
    --color-black: #424242;
    --duration-short: 0.15s;
    --font-system: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
      Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    --font-system-monospace: SFMono-Regular, Consolas, "Liberation Mono", Menlo,
      Courier, monospace;
    --shadow-low: 0 1px 2px rgba(43, 59, 93, 0.29);
    --shadow-high: 0 0 1px rgba(76, 86, 103, 0.25),
      0 2px 18px rgba(31, 37, 50, 0.32);
    --size-1: 0.0625rem;
    --size-2: 0.125rem;
    --size-3: 0.1875rem;
    --size-4: 0.25rem;
    --size-8: 0.5rem;
    --size-12: 0.75rem;
    --size-14: 0.875rem;
    --size-16: 1rem;
    --size-20: 1.25rem;
    --size-24: 1.5rem;
    --size-32: 2rem;
  }

  html {
    box-sizing: border-box;
    text-size-adjust: 100%;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  body {
    background-color: var(--color-light-gray);
    color: var(--color-black);
    display: flex;
    flex-direction: column;
    font-family: var(--font-system);
    font-size: var(--size-14);
    line-height: 1.42858;
    margin: 0;
  }

  p {
    margin: 0;
  }

  button {
    appearance: button;
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-system);
    font-size: var(--size-14);
    line-height: 1.42858;
    margin: 0;
    padding: 0;
    transition: opacity var(--duration-short);

    &::-moz-focus-inner {
      border-style: none;
      padding: 0;
    }

    &:-moz-focusring {
      outline: 1px dotted ButtonText;
    }

    &:hover,
    &:focus {
      opacity: 0.7;
    }
  }
`;

export default function App() {
  const [searchValue, setSearchValue] = useState("");
  const [collection, setCollection] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  function signOut() {
    firebase.auth().signOut();
    setCurrentUser(null);
  }

  function signIn({ email, displayName: name, photoURL: photoUrl, uid }) {
    if (email === "marie.ashtari@gmail.com") {
      firebase
        .firestore()
        .doc(`users/${uid}`)
        .set({ name, photoUrl, uid });
      setCurrentUser({ email, name, photoUrl, uid });
    } else {
      signOut();
    }
  }

  async function signInWithGoogle() {
    const google = new firebase.auth.GoogleAuthProvider();
    const { user } = await firebase.auth().signInWithPopup(google);
    signIn(user);
  }

  useEffect(
    () =>
      firebase.auth().onIdTokenChanged(user => {
        if (user) {
          signIn(user);
        }
        setLoading(false);
      }),
    [],
  );

  useEffect(
    () => {
      if (currentUser) {
        return firebase
          .firestore()
          .collection(`users/${currentUser.uid}/books`)
          .onSnapshot(query => {
            const books = query.docs.map(doc => doc.data());
            setCollection(books);
          });
      }
      setCollection([]);
      return undefined;
    },
    [currentUser],
  );

  return (
    <Context.Provider
      value={{ isLoading, currentUser, signInWithGoogle, signOut }}
    >
      <Global styles={globalStyles} />
      {!isLoading && (
        <Router>
          <HomePage
            path="/"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <SearchPage
            path="/search"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            collection={collection}
            currentUser={currentUser}
          />
          <MyCollectionPage
            path="/:userId"
            collection={collection}
            currentUser={currentUser}
          />
        </Router>
      )}
    </Context.Provider>
  );
}
