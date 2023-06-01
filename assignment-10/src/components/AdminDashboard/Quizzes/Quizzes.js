import React, { useEffect, useState } from "react";
import { size } from "lodash";
import Quiz from "components/AdminDashboard/Quizzes/Quiz";
import LoadingSpinner from "components/shared/LoadingSpinner";
import Navbar from "components/shared/Navbar";
import NothingToFound from "components/shared/NothingToFound";
import { useGetQuizzesQuery } from "features/admin/quizzes/quizzesApi";
import { toastAlert } from "utils/AppHelpers";
import EditQuizModal from "components/AdminDashboard/Quizzes/EditQuizModal";
import AddQuizModal from "components/AdminDashboard/Quizzes/AddQuizModal";

const Quizzes = () => {
  const { data: quizzes, isLoading, isError, error } = useGetQuizzesQuery();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [quizId, setQuizId] = useState();

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
                Add Quiz
              </button>
            </div>
            <div className="overflow-x-auto mt-4">
              {(() => {
                if (isLoading) {
                  return <LoadingSpinner />;
                }
                if (size(quizzes)) {
                  return (
                    <Quiz
                      quizzes={quizzes}
                      setOpenEditModal={setOpenEditModal}
                      setQuizId={setQuizId}
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
      <AddQuizModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />
      {quizId && (
        <EditQuizModal
          quizId={quizId}
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          setQuizId={setQuizId}
        />
      )}
    </>
  );
};

export default Quizzes;
