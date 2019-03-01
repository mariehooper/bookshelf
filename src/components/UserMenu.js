import { css } from "@emotion/core";
import { Link } from "@reach/router";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";

const menuStyles = css`
  position: absolute;
  background-color: var(--color-white);
  color: var(--color-black);
  list-style-type: none;
  width: 180px;
  right: 0;
  border-radius: var(--size-3);
  border: 1px solid #eee;
  box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
  padding: var(--size-4) 0;
  margin: var(--size-16);
  z-index: 1;

  &::before {
    content: "";
    display: inline-block;
    position: absolute;
    left: auto;
    right: var(--size-16);
    top: -1rem;
    border: var(--size-8) solid transparent;
    border-bottom-color: var(--color-white);
  }

  a {
    text-decoration: none;
  }

  button {
    width: 100%;
    text-align: left;
  }

  a,
  button {
    display: block;
    color: inherit;
    font-size: var(--size-16);
    padding: var(--size-8) var(--size-16);

    &:hover,
    :focus {
      background-color: var(--color-blue-gray);
      opacity: initial;
    }
  }
`;

const triggerStyles = css`
  color: inherit;
`;

export default function UserMenu({ user, signOut }) {
  const [isOpen, setOpen] = useState(false);
  const wrapperElement = useRef(null);
  const menuButtonElement = useRef(null);
  const myCollectionElement = useRef(null);
  const signOutElement = useRef(null);

  function closeOnEscOrTab(event) {
    const isTab = event.keyCode === 9;
    const isEsc = event.keyCode === 27;
    if (isTab || isEsc) {
      // eslint-disable-next-line no-use-before-define
      closeMenu();
      if (isEsc) {
        menuButtonElement.current.focus();
      }
    }
  }

  function closeOnOuterClick(event) {
    if (
      wrapperElement.current &&
      !wrapperElement.current.contains(event.target)
    ) {
      // eslint-disable-next-line no-use-before-define
      closeMenu();
    }
  }

  function openMenu() {
    document.addEventListener("click", closeOnOuterClick);
    document.addEventListener("keydown", closeOnEscOrTab);
    setOpen(true);
  }

  function closeMenu() {
    document.removeEventListener("click", closeOnOuterClick);
    document.removeEventListener("keydown", closeOnEscOrTab);
    setOpen(false);
  }

  async function focusOnSomeKeyPresses(event) {
    const isEnd = event.keyCode === 35;
    const isHome = event.keyCode === 36;
    const isUp = event.keyCode === 38;
    const isDown = event.keyCode === 40;
    const { currentTarget } = event;
    if (isEnd || isHome || isUp || isDown) {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
        await Promise.resolve();
      }
      if (isEnd) {
        signOutElement.current.focus();
      }
      if (isHome) {
        myCollectionElement.current.focus();
      }
      if (isUp || isDown) {
        if (currentTarget === myCollectionElement.current) {
          signOutElement.current.focus();
        } else {
          myCollectionElement.current.focus();
        }
      }
    }
  }

  return (
    <div ref={wrapperElement}>
      <button
        ref={menuButtonElement}
        css={triggerStyles}
        type="button"
        onKeyDown={focusOnSomeKeyPresses}
        onClick={() => {
          if (isOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
      >
        {user.name}
      </button>
      {isOpen && (
        <ul css={menuStyles}>
          <li>
            <Link
              ref={myCollectionElement}
              to={`/${user.uid}`}
              onClick={closeMenu}
              onKeyDown={focusOnSomeKeyPresses}
            >
              My collection
            </Link>
          </li>
          <li>
            <button
              onClick={signOut}
              onKeyDown={focusOnSomeKeyPresses}
              ref={signOutElement}
              type="button"
            >
              Sign out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

UserMenu.propTypes = {
  signOut: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    photoUrl: PropTypes.string,
  }),
};

UserMenu.defaultProps = { user: null };
