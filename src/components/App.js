import { css, Global } from "@emotion/core";
import React, { useState } from "react";
import { Router, Link } from "@reach/router";
import HomePage from "./HomePage";
import SearchPage from "./SearchPage";

const globalStyles = css`
  :root {
    --color-blue: #243b55;
    --color-dark-blue: #141e30;
    --color-white: #fff;
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

  #app {
    height: 100vh;
  }

  body {
    background-color: var(--color-white);
    color: var(--color-black);
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

const headerStyles = css`
  align-items: center;
  background: transparent;
  color: var(--color-blue);
  display: flex;
  justify-content: space-between;
  padding: var(--size-8) var(--size-24);
  position: absolute;
  width: 100%;
  z-index: 100;

  [data-homepage] & {
    color: var(--color-white);
  }
`;

const logoStyles = css`
  font-size: var(--size-20);
  font-family: var(--font-system-monospace);
  line-height: 1.6;
  margin: 0;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const contentCss = css`
  padding: var(--size-24);
  height: 100vh;
`;

export default function App() {
  const [searchValue, setSearchValue] = useState("");
  return (
    <React.Fragment>
      <Global styles={globalStyles} />
      <header css={headerStyles}>
        <span css={logoStyles}>
          <Link to="/">Bookshelf</Link>
        </span>
      </header>
      <Router css={contentCss} component="main">
        <HomePage
          path="/"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <SearchPage
          path="/search"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </Router>
    </React.Fragment>
  );
}
