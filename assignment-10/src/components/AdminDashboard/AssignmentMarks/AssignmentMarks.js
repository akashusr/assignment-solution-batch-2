import React, { useEffect, useState } from "react";
import Navbar from "components/shared/Navbar";
import { useGetAssignmentMarksQuery } from "features/admin/assignment-mark/assignmentApi";
import { size } from "lodash";
import AssignmentMark from "components/AdminDashboard/AssignmentMarks/AssignmentMark";
import { toastAlert } from "utils/AppHelpers";
import LoadingSpinner from "components/shared/LoadingSpinner";
import NothingToFound from "components/shared/NothingToFound";

const AssignmentMarks = () => {
  const [status, setStatus] = useState("all");
  const {
    data: assignmentMarks,
    isLoading,
    isError,
    error,
  } = useGetAssignmentMarksQuery();

  // count total, pending and published assignment mark
  const countTotal = (status) =>
    assignmentMarks?.reduce(
      (accumulator, currentData) =>
        currentData?.status?.toLowerCase() === status
          ? accumulator + 1
          : accumulator,
      0
    );

  const filteredAssignmentMarks = (assignment) => {
    if (status === "all") {
      return true;
    }
    return assignment?.status === status;
  };

  useEffect(() => {
    if (isError) {
      toastAlert("error", error?.data || error?.error);
    }
  }, [error, isError]);

  const handleChangeStatus = (context) => {
    setStatus(context);
  };

  return (
    <>
      <Navbar />

      {/* main body */}
      <section className="py-6 bg-primary">
        <div className="mx-auto max-w-full px-5 lg:px-20">
          <div className="px-3 py-20 bg-opacity-10">
            <ul className="assignment-status">
              <li
                role="button"
                tabIndex="0"
                className={status === "all" ? "assignment-total" : ""}
                onClick={() => handleChangeStatus("all")}
              >
                Total <span>{size(assignmentMarks)}</span>
              </li>
              <li
                role="button"
                tabIndex="0"
                className={status === "pending" ? "assignment-pending" : ""}
                onClick={() => handleChangeStatus("pending")}
              >
                Pending <span>{countTotal("pending")}</span>
              </li>
              <li
                role="button"
                tabIndex="0"
                className={status === "published" ? "assignment-published" : ""}
                onClick={() => handleChangeStatus("published")}
              >
                Mark Sent <span>{countTotal("published")}</span>
              </li>
            </ul>
            <div className="overflow-x-auto mt-4">
              {(() => {
                if (isLoading) {
                  return <LoadingSpinner />;
                }
                if (size(assignmentMarks)) {
                  return (
                    <table className="divide-y-1 text-base divide-gray-600 w-full">
                      <thead>
                        <tr>
                          <th className="table-th">Assignment</th>
                          <th className="table-th">Date</th>
                          <th className="table-th">Student Name</th>
                          <th className="table-th">Repo Link</th>
                          <th className="table-th">Mark</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-600/50">
                        {(() => {
                          if (
                            size(
                              assignmentMarks?.filter(filteredAssignmentMarks)
                            )
                          ) {
                            return assignmentMarks
                              ?.filter(filteredAssignmentMarks)
                              ?.map((item) => (
                                <AssignmentMark
                                  key={item?.id}
                                  assignment={item}
                                />
                              ));
                          }
                          return (
                            <tr>
                              <td colSpan="13">
                                <NothingToFound customClass="pt-8 text-sm" />
                              </td>
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>
                  );
                }
                return <NothingToFound />;
              })()}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AssignmentMarks;
