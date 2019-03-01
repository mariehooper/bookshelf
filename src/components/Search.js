import React from "react";
import PropTypes from "prop-types";
import { css } from "@emotion/core";

const searchWrapperCss = css`
  position: relative;

  input:focus {
    outline: none;
    filter: drop-shadow(0 0 2px #00bcd4);
  }
`;

const searchIconCss = css`
  height: var(--size-24);
  width: var(--size-24);
  position: absolute;
  top: var(--size-12);
  left: var(--size-8);
`;

const searchCss = css`
  display: block;
  width: 100%;
  padding: var(--size-8) var(--size-8) var(--size-8) 2.5rem;
  font-size: var(--size-16);
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
  height: 48px;
  transition: box-shadow 200ms ease-in 0s;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(235, 235, 235);
  border-radius: var(--size-4);
`;

export default function Search({ onSubmit, value, onChange }) {
  return (
    <form
      css={searchWrapperCss}
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        css={searchCss}
        type="text"
        value={value}
        placeholder="Search title, author, or ISBN"
        onChange={event => {
          onChange(event.currentTarget.value);
        }}
      />
      <svg css={searchIconCss} viewBox="0 0 32 32">
        <title>search</title>
        <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
      </svg>
    </form>
  );
}

Search.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

Search.defaultProps = {
  onSubmit: () => {},
};
