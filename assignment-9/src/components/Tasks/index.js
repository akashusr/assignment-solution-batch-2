import React from "react";
import { Link } from "react-router-dom";
import Task from "components/Tasks/Task";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
} from "features/tasks/tasksApi";
import { size } from "lodash";
import Error from "utils/Error";
import { useSelector } from "react-redux";
import { getProjectNameKey } from "utils/AppHelpers";
import warningMessage from "utils/warningMessage";

const Tasks = () => {
  const { selectedProjectNames: projectNames, searchKey } = useSelector(
    (state) => state.filters
  );
  const { data: tasks, isLoading, isError } = useGetTasksQuery();

  const filteredTask = (task) => {
    const taskProjectName = getProjectNameKey(task?.project?.projectName);
    return projectNames?.includes(taskProjectName);
  };

  const taskSearchByName = (task) =>
    task?.taskName?.toLowerCase()?.includes(searchKey);

  // delete task api
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  return (
    <div className="lg:pl-[16rem] 2xl:pl-[23rem]">
      <main className="relative z-20 max-w-3xl mx-auto rounded-lg xl:max-w-none">
        <div className="justify-between mb-10 space-y-2 md:flex md:space-y-0">
          <Link to="create-task" className="lws-addnew group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 group-hover:text-indigo-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>

            <span className="group-hover:text-indigo-500">Add New</span>
          </Link>
        </div>

        <div className="lws-task-list">
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
            if (size(tasks)) {
              if (size(tasks?.filter(filteredTask)?.filter(taskSearchByName))) {
                return tasks
                  ?.filter(filteredTask)
                  ?.filter(taskSearchByName)
                  ?.map((task) => (
                    <Task
                      key={task?.id}
                      task={task}
                      isDeleting={isDeleting}
                      deleteTask={deleteTask}
                    />
                  ));
              }
              return warningMessage(
                "We're sorry. We cannot find any matches for your search term or filter."
              );
            }
            return <p className="m-2 text-center">No task found!</p>;
          })()}
        </div>
      </main>
    </div>
  );
};

export default Tasks;
