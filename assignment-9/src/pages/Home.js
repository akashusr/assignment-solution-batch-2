import React from "react";
import Projects from "components/Projects";
import Tasks from "components/Tasks";
import TeamMembers from "components/TeamMembers";

function Home() {
  return (
    <div className="container relative">
      {/* sidebar */}
      <div className="sidebar">
        <Projects />
        <TeamMembers />
      </div>

      {/* tasks */}
      <Tasks />
    </div>
  );
}

export default Home;
