import React, { useEffect } from "react";
import { useGetProjectsQuery } from "features/projects/projectApi";
import { size } from "lodash";
import { getProjectNameKey } from "utils/AppHelpers";
import Error from "utils/Error";
import { useDispatch, useSelector } from "react-redux";
import {
  filteredByProject,
  getProjectNames,
} from "features/filters/filtersSlice";

const Projects = () => {
  const projectNames = useSelector(
    (state) => state.filters.selectedProjectNames
  );
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  // dispatch
  const dispatch = useDispatch();

  useEffect(() => {
    if (size(projects)) {
      const projectNames = projects?.map((project) =>
        getProjectNameKey(project.projectName)
      );
      if (size(projectNames)) {
        dispatch(getProjectNames(projectNames));
      }
    }
  }, [dispatch, projects]);

  const handleChange = (context, isChecked) => {
    dispatch(filteredByProject({ context, isChecked }));
  };

  return (
    <div>
      <h3 className="text-xl font-bold">Projects</h3>
      <div className="mt-3 space-y-4">
        {(() => {
          if (isLoading) {
            return <p className="m-2 text-center">Loading...</p>;
          }
          if (isError) {
            return (
              <p className="m-2 text-center">
                <Error />
              </p>
            );
          }
          if (size(projects)) {
            return projects?.map((project) => {
              const { id, projectName, colorClass } = project;
              const projectKey = getProjectNameKey(projectName);

              return (
                <div key={id} className="checkbox-container">
                  <input
                    type="checkbox"
                    id={projectKey}
                    className={colorClass}
                    checked={projectNames?.includes(projectKey)}
                    onChange={(e) => handleChange(projectKey, e.target.checked)}
                  />
                  <label htmlFor={projectKey} className="label">
                    {projectName}
                  </label>
                </div>
              );
            });
          }
          return <p className="m-2 text-center">No projects found!</p>;
        })()}
      </div>
    </div>
  );
};

export default Projects;
