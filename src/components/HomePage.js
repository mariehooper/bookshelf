import { css } from "@emotion/core";
import { navigate } from "@reach/router";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import Search from "./Search";
import WithHeader from "./WithHeader";

const wrapperCss = css`
  background-image: url("./susan-yin-647448-unsplash.jpg");
  background-size: cover;
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const overlayCss = css`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const frameCss = css`
  margin: 10rem auto 0 auto;
  width: 50%;

  h1 {
    color: var(--color-white);
    font-size: 2.5rem;
    font-weight: 400;
    text-shadow: 1px 6px 84px rgba(0, 0, 0, 0.8);
    margin: var(--size-16) 0;
  }
`;

export default function HomePage({ searchValue, setSearchValue }) {
  useEffect(() => {
    setSearchValue("");
  }, []);

  return (
    <div css={wrapperCss}>
      <div css={overlayCss}>
        <WithHeader transparent>
          <div css={frameCss}>
            <h1>Add a book to your collection</h1>
            <div>
              <Search
                value={searchValue}
                onChange={setSearchValue}
                onSubmit={() => {
                  navigate(`/search`);
                }}
              />
            </div>
          </div>
        </WithHeader>
      </div>
    </div>
  );
}

HomePage.propTypes = {
  setSearchValue: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
};
