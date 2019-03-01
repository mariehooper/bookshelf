import { css } from "@emotion/core";
import { Link } from "@reach/router";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import Context from "./Context";
import UserMenu from "./UserMenu";

const headerStyles = css`
  align-items: center;
  background: var(--color-white);
  border-bottom: 1px solid rgb(228, 228, 228);
  display: flex;
  justify-content: space-between;
  padding: var(--size-8) var(--size-24);
  width: 100%;
  z-index: 100;

  button {
    color: inherit;
    font-size: var(--size-16);

    &:hover,
    :focus {
      opacity: inherit;
    }
  }
`;

const transparentStyles = css`
  ${headerStyles};
  background: transparent;
  border-bottom: 0;
  color: var(--color-white);
`;

const logoStyles = css`
  font-size: var(--size-20);
  font-family: "Rubik", sans-serif;
  line-height: 1.6;
  margin: 0;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const signInCss = css`
  color: inherit;
`;

const contentCss = css`
  padding: 0 var(--size-24) var(--size-24);
`;

export default function WithHeader({ transparent, children }) {
  const { isLoading, currentUser, signInWithGoogle, signOut } = useContext(
    Context,
  );
  return (
    <React.Fragment>
      <header css={transparent ? transparentStyles : headerStyles}>
        <span css={logoStyles}>
          <Link to="/">Bookshelf</Link>
        </span>
        {!isLoading &&
          (currentUser ? (
            <UserMenu user={currentUser} signOut={signOut} />
          ) : (
            <button css={signInCss} onClick={signInWithGoogle} type="button">
              Sign in
            </button>
          ))}
      </header>
      <main css={contentCss}>{children}</main>
    </React.Fragment>
  );
}

WithHeader.propTypes = {
  transparent: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

WithHeader.defaultProps = {
  transparent: false,
};
