import React, { useRef, useState } from "react";
import { useGetProjectsQuery } from "features/projects/projectApi";
import { useEditTaskMutation } from "features/tasks/tasksApi";
import { useGetTeamQuery } from "features/team/teamApi";
import { size } from "lodash";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastAlert } from "utils/AppHelpers";

const Form = ({ task }) => {
  const { data: team } = useGetTeamQuery();
  const { data: projects } = useGetProjectsQuery();
  const [mutationData, setMutationData] = useState(task);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const toastId = useRef(null);

  const handleChange = (name, value) => {
    setMutationData((prevData) => ({ ...prevData, [name]: value }));
  };

  // update task
  const [editTask, { isLoading }] = useEditTaskMutation();
  const handleUpdateTask = (e) => {
    e.preventDefault();
    toast.dismiss(toastId.current);

    const updatedData = { ...mutationData };
    delete updatedData.id;

    if (size(updatedData)) {
      editTask({ id: mutationData?.id, data: updatedData })
        .unwrap()
        .then((res) => {
          if (size(res)) {
            toastAlert("success", "Updated successfully!");
            navigate("/");
            formRef.current.reset();
            setMutationData({});
          }
        })
        .catch((err) =>
          toastAlert(
            "error",
            err?.error || "Something went wrong! Please try again."
          )
        );
    }
  };

  return (
    <form ref={formRef} onSubmit={handleUpdateTask} className="space-y-6">
      <div className="fieldContainer">
        <label htmlFor="lws-taskName">Task Name</label>
        <input
          type="text"
          name="taskName"
          id="lws-taskName"
          required
          placeholder="Enter task name"
          value={mutationData?.taskName || ""}
          onChange={(e) => handleChange("taskName", e.target.value)}
        />
      </div>

      <div className="fieldContainer">
        <label>Assign To</label>
        <select
          name="teamMember"
          id="lws-teamMember"
          required
          value={mutationData?.teamMember?.id || ""}
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
          value={mutationData?.project?.id || ""}
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
          value={mutationData?.deadline || ""}
          onChange={(e) => handleChange("deadline", e.target.value)}
        />
      </div>

      <div className="text-right">
        <button type="submit" disabled={isLoading} className="lws-submit">
          {isLoading ? "Saving" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default Form;
