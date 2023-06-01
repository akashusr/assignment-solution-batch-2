import Blogs from "components/blogs/Blogs";
import SidebarFilters from "components/sidebarFilters/SidebarFilters";
import React from "react";

const Home = () => {
  return (
    <section className="wrapper">
      <SidebarFilters />
      {/*  posts container */}
      <Blogs />
      {/* posts container ends */}
    </section>
  );
};

export default Home;
