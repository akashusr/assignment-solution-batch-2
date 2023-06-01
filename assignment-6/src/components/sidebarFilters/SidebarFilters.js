import { sortChanged, statusSelected } from "features/filters/filtersSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const SidebarFilters = () => {
  const { status, sort: selectedValue } = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  return (
    <aside>
      <div className="sidebar-items">
        <div className="sidebar-content">
          <h4>Sort</h4>
          <select
            name="sort"
            id="lws-sort"
            className="w-full max-w-[150px] border-2 rounded-md text-gray-500"
            onChange={(e) => dispatch(sortChanged(e.target.value))}
            defaultValue={selectedValue}
          >
            <option value="default">Default</option>
            <option value="newest">Newest</option>
            <option value="most_liked">Most Liked</option>
          </select>
        </div>
        <div className="sidebar-content">
          <h4>Filter</h4>
          <div className="radio-group">
            {/* handle filter on button click */}
            <div>
              <input
                type="radio"
                name="filter"
                id="lws-all"
                checked={status === "all"}
                className="radio"
                onChange={(e) => dispatch(statusSelected("all"))}
              />
              <label htmlFor="lws-all">All</label>
            </div>
            <div>
              <input
                type="radio"
                name="filter"
                id="lws-saved"
                checked={status === "saved"}
                className="radio"
                onChange={(e) => dispatch(statusSelected("saved"))}
              />
              <label htmlFor="lws-saved">Saved</label>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilters;
