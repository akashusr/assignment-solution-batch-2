import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { editInActive, jobTypeChanged } from "features/jobs/jobsSlice";

const Layout = ({ children }) => {
  const { selectedType } = useSelector((state) => state.jobs);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTypeChange = (type) => {
    dispatch(jobTypeChanged(type));
    navigate("/");
  };

  return (
    <>
      {/* navbar */}
      <nav className="max-w-[90rem] mx-auto py-4 fixed top-0 w-full left-1/2 -translate-x-1/2 px-4 md:px-0">
        <span
          role="button"
          tabIndex="0"
          onClick={() => handleTypeChange("all_available")}
        >
          <img src={Logo} alt="logo" />
        </span>
      </nav>

      {/* main section */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 ">
        {/* sidebar */}
        <div className="sidebar">
          <nav>
            <ul className="space-y-4">
              <li>
                <span
                  role="button"
                  tabIndex="0"
                  className={`main-menu ${
                    location?.pathname === "/" && "menu-active"
                  }`}
                  id="lws-alljobs-menu"
                  onClick={() => handleTypeChange("all_available")}
                >
                  <i className="fa-solid fa-briefcase"></i>
                  <span> All Available Jobs</span>
                </span>
                <ul className="space-y-6 lg:space-y-2 ">
                  <li>
                    <span
                      role="button"
                      tabIndex="0"
                      className={`sub-menu ${
                        selectedType === "internship" && "sub-menu-active"
                      }`}
                      id="lws-internship-menu"
                      onClick={() => handleTypeChange("internship")}
                    >
                      <i className="fa-solid fa-stop !text-[#FF5757]"></i>
                      <span> Internship </span>
                    </span>
                  </li>
                  <li>
                    <span
                      role="button"
                      tabIndex="0"
                      className={`sub-menu ${
                        selectedType === "full_time" && "sub-menu-active"
                      }`}
                      id="lws-fulltime-menu"
                      onClick={() => handleTypeChange("full_time")}
                    >
                      <i className="fa-solid fa-stop !text-[#FF8A00]"></i>
                      <span> Full Time </span>
                    </span>
                  </li>
                  <li>
                    <span
                      role="button"
                      tabIndex="0"
                      className={`sub-menu ${
                        selectedType === "remote" && "sub-menu-active"
                      }`}
                      id="lws-remote-menu"
                      onClick={() => handleTypeChange("remote")}
                    >
                      <i className="fa-solid fa-stop !text-[#56E5C4]"></i>
                      <span> Remote </span>
                    </span>
                  </li>
                </ul>
              </li>
              <li>
                <span
                  role="button"
                  tabIndex="0"
                  className={`main-menu ${
                    location?.pathname === "/jobs/create" && "menu-active"
                  }`}
                  id="lws-addJob-menu"
                  onClick={() => {
                    dispatch(jobTypeChanged("all_available"));
                    dispatch(editInActive({}));
                    navigate("jobs/create");
                  }}
                >
                  <i className="fa-solid fa-file-circle-plus"></i>
                  <span> Add NewJob</span>
                </span>
              </li>
            </ul>
          </nav>
        </div>

        {/* others children */}
        {children}
      </div>
    </>
  );
};

export default Layout;
