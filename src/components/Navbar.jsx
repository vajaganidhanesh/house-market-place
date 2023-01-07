import React from "react";
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <>
      <footer className="navbar">
        <nav className="navbarNav">
          <ul className="navbarListItems">
            <li
              className="navbarListItem"
              onClick={() => {
                navigate("/explore");
              }}
            >
              <ExploreIcon
                fill={pathMatchRoute("/explore") ? "2c2c2c" : "#8f8f8f"}
                width="36px"
                height="36px"
              />
              <p
                className={
                  pathMatchRoute("/explore")
                    ? "navbarListItemNameActive"
                    : "navbarListItemName"
                }
              >
                Explore
                </p>
            </li>
            <li
              className="navbarListItem"
              onClick={() => {
                navigate("/offers");
              }}
            >
              <OfferIcon
                fill={pathMatchRoute("/offers") ? "2c2c2c" : "#8f8f8f"}
                width="36px"
                height="36px"
              />
              <p
                className={
                  pathMatchRoute("/offers")
                    ? "navbarListItemNameActive"
                    : "navbarListItemName"
                }
              >
                Offers</p>
            </li>
            <li
              className="navbarListItem"
              onClick={() => {
                navigate("/sign-in");
              }}
            >
              <PersonOutlineIcon
                fill={pathMatchRoute("/sign-in") ? "2c2c2c" : "#8f8f8f"}
                width="36px"
                height="36px"
              />
              <p
                className={
                  pathMatchRoute("/sign-in")
                    ? "navbarListItemNameActive"
                    : "navbarListItemName"
                }
              >
                Profile
              </p>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
}

export default Navbar;
