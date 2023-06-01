import React from "react";
import Logo from "assets/logo.svg";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchFiltered } from "features/filters/filtersSlice";
import { debounce } from "lodash";

const Navbar = () => {
  const dispatch = useDispatch();

  // task search
  const handleSearch = debounce(
    (value) => dispatch(searchFiltered(value)),
    600
  );

  return (
    <nav className="container relative py-3">
      <div className="flex items-center justify-between">
        <Link to="/">
          <img src={Logo} alt="logo" />
        </Link>
        <div className="flex-1 max-w-xs search-field group">
          <i className="fa-solid fa-magnifying-glass search-icon group-focus-within:text-blue-500"></i>
          <input
            type="text"
            placeholder="Search task by name"
            className="search-input"
            id="lws-searchTask"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
