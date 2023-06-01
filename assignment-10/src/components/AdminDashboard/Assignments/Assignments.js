import React, { useEffect, useState } from "react";
import { size } from "lodash";
import { toastAlert } from "utils/AppHelpers";
import LoadingSpinner from "components/shared/LoadingSpinner";
import Navbar from "components/shared/Navbar";
import NothingToFound from "components/shared/NothingToFound";
import { useGetAssignmentsQuery } from "features/admin/assignments/assignmentsApi";
import Assignment from "components/AdminDashboard/Assignments/Assignment";
import AddAssignment from "components/AdminDashboard/Assignments/AddAssignment";
import EditAssignmentModal from "components/AdminDashboard/Assignments/EditAssignmentModal";

const Assignments = () => {
  const {
    data: assignments,
    isLoading,
    isError,
    error,
  } = useGetAssignmentsQuery();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [assignmentId, setAssignmentId] = useState();

  useEffect(() => {
    if (isError) {
      toastAlert("error", error?.data || error?.error);
    }
  }, [error, isError]);

  return (
    <>
      <Navbar />

      {/* main body */}
      <section className="py-6 bg-primary">
        <div className="mx-auto max-w-full px-5 lg:px-20">
          <div className="px-3 py-20 bg-opacity-10">
            <div className="w-full flex">
              <button
                onClick={() => setOpenAddModal(true)}
                className="btn ml-auto"
              >
                Add Assignment
              </button>
            </div>
            <div className="overflow-x-auto mt-4">
              {(() => {
                if (isLoading) {
                  return <LoadingSpinner />;
                }
                if (size(assignments)) {
                  return (
                    <Assignment
                      assignments={assignments}
                      setOpenEditModal={setOpenEditModal}
                      setAssignmentId={setAssignmentId}
                    />
                  );
                }
                return <NothingToFound />;
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* modals */}
      <AddAssignment
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />
      {assignmentId && (
        <EditAssignmentModal
          assignmentId={assignmentId}
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          setAssignmentId={setAssignmentId}
        />
      )}
    </>
  );
};

export default Assignments;
