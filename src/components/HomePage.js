import { css } from "@emotion/core";
import { navigate } from "@reach/router";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import Search from "./Search";

const wrapperCss = css`
  background-image: url("./susan-yin-647448-unsplash.jpg");
  background-size: cover;
  display: flex;
  height: calc(100% + 48px);
  width: calc(100% + 48px);
  margin-left: -24px;
  margin-top: -24px;
`;

const overlayCss = css`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const frameCss = css`
  margin: 200px auto 0 auto;
  width: 50%;

  h1 {
    color: var(--color-white);
    font-size: 2.5rem;
    font-weight: 400;
    text-shadow: 1px 6px 84px rgba(0, 0, 0, 0.8);
    margin: 1rem 0;
  }
`;

export default function HomePage({ searchValue, setSearchValue }) {
  useEffect(() => {
    setSearchValue("");
    document.getElementById("app").dataset.homepage = "";
    return () => {
      delete document.getElementById("app").dataset.homepage;
    };
  }, []);

  return (
    <div css={wrapperCss} className="wrapper">
      <div css={overlayCss}>
        <div css={frameCss}>
          <h1>Add a book to your collection</h1>
          <div>
            <Search
              value={searchValue}
              onChange={setSearchValue}
              onSubmit={event => {
                event.preventDefault();
                navigate(`/search`);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

HomePage.propTypes = {
  setSearchValue: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
};
