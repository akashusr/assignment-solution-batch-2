import { useGetTaskQuery } from "features/tasks/tasksApi";
import React from "react";
import { useParams } from "react-router-dom";
import Form from "components/EditTask/Form";
import Error from "utils/Error";
import { size } from "lodash";

const EditTask = () => {
  const { id } = useParams();
  const { data: task, isLoading, isError, error } = useGetTaskQuery(id);

  return (
    <div className="container relative">
      <main className="relative z-20 max-w-3xl mx-auto rounded-lg xl:max-w-none">
        <h1 className="mt-4 mb-8 text-3xl font-bold text-center text-gray-800">
          Edit Task for Your Team
        </h1>

        <div className="justify-center mb-10 space-y-2 md:flex md:space-y-0">
          {(() => {
            if (isLoading) {
              return <p className="m-2 text-center">Loading...</p>;
            }
            if (isError) {
              return (
                <div className="height-200 flex align-center justify-center">
                  <Error message={error?.error} />
                </div>
              );
            }
            if (size(task)) {
              return <Form task={task} />;
            }
            return <p>No task found!</p>;
          })()}
        </div>
      </main>
    </div>
  );
};

export default EditTask;
