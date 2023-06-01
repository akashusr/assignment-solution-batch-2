import React, { useRef, useState } from "react";
import { useGetProjectsQuery } from "features/projects/projectApi";
import { useAddTaskMutation } from "features/tasks/tasksApi";
import { useGetTeamQuery } from "features/team/teamApi";
import { size } from "lodash";
import { useNavigate } from "react-router-dom";
import { toastAlert } from "utils/AppHelpers";

const AddTask = () => {
  const { data: team } = useGetTeamQuery();
  const { data: projects } = useGetProjectsQuery();
  const [mutationData, setMutationData] = useState({});
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (type, value) => {
    setMutationData((prevData) => ({ ...prevData, [type]: value }));
  };

  // add task
  const [addTask, { isLoading }] = useAddTaskMutation();
  const handleTaskSubmit = (e) => {
    e.preventDefault();

    addTask(mutationData)
      .unwrap()
      .then((res) => {
        if (size(res)) {
          toastAlert("success", "Task added successfully!");
          formRef.current.reset();
          setMutationData({});
          navigate("/");
        }
      })
      .catch((error) =>
        toastAlert(
          "error",
          error?.error || "Something went wrong! Please try again."
        )
      );
  };

  return (
    <div className="container relative">
      <main className="relative z-20 max-w-3xl mx-auto rounded-lg xl:max-w-none">
        <h1 className="mt-4 mb-8 text-3xl font-bold text-center text-gray-800">
          Create Task for Your Team
        </h1>

        <div className="justify-center mb-10 space-y-2 md:flex md:space-y-0">
          <form ref={formRef} onSubmit={handleTaskSubmit} className="space-y-6">
            <div className="fieldContainer">
              <label htmlFor="lws-taskName">Task Name</label>
              <input
                type="text"
                name="taskName"
                id="lws-taskName"
                required
                placeholder="Enter task name"
                onChange={(e) => handleChange("taskName", e.target.value)}
              />
            </div>

            <div className="fieldContainer">
              <label>Assign To</label>
              <select
                name="teamMember"
                id="lws-teamMember"
                required
                onChange={(e) => {
                  const member = team?.find(
                    (member) => member?.id === parseInt(e.target.value)
                  );
                  if (size(member)) {
                    handleChange("teamMember", member);
                  }
                }}
              >
                <option value="" hidden>
                  Select task
                </option>
                {team?.map((member) => (
                  <option key={member?.id} value={member?.id}>
                    {member?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="fieldContainer">
              <label htmlFor="lws-projectName">Project Name</label>
              <select
                id="lws-projectName"
                name="projectName"
                required
                onChange={(e) => {
                  const project = projects?.find(
                    (project) => project?.id === parseInt(e.target.value)
                  );
                  if (size(project)) {
                    handleChange("project", project);
                  }
                }}
              >
                <option value="" hidden>
                  Select project
                </option>
                {projects?.map((project) => (
                  <option key={project?.id} value={project?.id}>
                    {project?.projectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="fieldContainer">
              <label htmlFor="lws-deadline">Deadline</label>
              <input
                type="date"
                name="deadline"
                id="lws-deadline"
                required
                onChange={(e) => handleChange("deadline", e.target.value)}
              />
            </div>

            <div className="text-right">
              <button type="submit" disabled={isLoading} className="lws-submit">
                {isLoading ? "Saving" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddTask;
