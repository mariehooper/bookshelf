import React from "react";
import PropTypes from "prop-types";
import { css } from "@emotion/core";

const searchWrapperCss = css`
  position: relative;

  .search-icon {
    height: 1.5rem;
    width: 1.5rem;
    position: absolute;
    top: 0.75rem;
    left: 0.5rem;
  }
`;

const searchCss = css`
  display: block;
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 2.5rem;
  font-size: 1rem;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
  height: 48px;
  transition: box-shadow 200ms ease-in 0s;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(235, 235, 235);
  border-radius: 4px;
`;

export default function Search({ onSubmit, value, onChange }) {
  return (
    <form css={searchWrapperCss} onSubmit={onSubmit}>
      <input
        css={searchCss}
        type="text"
        value={value}
        placeholder="Search title, author, or ISBN"
        onChange={event => {
          onChange(event.currentTarget.value);
        }}
      />
      <svg className="search-icon" viewBox="0 0 32 32">
        <title>search</title>
        <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
      </svg>
    </form>
  );
}

Search.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
