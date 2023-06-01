import React, { useRef, useState } from "react";
import { Modal, TextInput } from "@mantine/core";
import { useSelector } from "react-redux";
import { size } from "lodash";
import { toastAlert, validatedInputField } from "utils/AppHelpers";
import { toast } from "react-toastify";
import { useSubmitAssignmentMutation } from "features/student/course-player/coursePlayerApi";
import moment from "moment";

const StudentAssignmentModal = ({
  openAssignmentModal,
  setOpenAssignmentModal,
}) => {
  const { coursePlayer, auth } = useSelector((state) => state);
  const [mutationData, setMutationData] = useState({});
  const formRef = useRef(null);
  const toastId = useRef(null);

  const handleChange = (type, value) => {
    setMutationData((prevData) => ({
      ...prevData,
      [type]: value,
    }));
  };

  const handleCloseModal = () => {
    setOpenAssignmentModal(false);
    formRef.current.reset();
    setMutationData({});
  };

  // submit assignment
  const [submitAssignment, { isLoading }] = useSubmitAssignmentMutation();
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.dismiss(toastId.current);

    const { user } = auth;
    const { assignmentInfo } = coursePlayer;

    const updatedData = {
      student_id: user?.id,
      student_name: user?.name,
      assignment_id: assignmentInfo?.id,
      title: assignmentInfo?.title,
      totalMark: assignmentInfo?.totalMark,
      mark: 0,
      status: "pending",
      createdAt: moment().format(),
      ...mutationData,
    };

    if (size(updatedData)) {
      submitAssignment(updatedData)
        .unwrap()
        .then((res) => {
          handleCloseModal();
        })
        .catch((err) => toastAlert("error", err?.data || err?.error));
    }
  };

  return (
    <>
      <Modal
        opened={openAssignmentModal}
        onClose={handleCloseModal}
        title=" "
        size="lg"
        overlayProps={{
          bg: "rgb(15, 23, 42)",
        }}
        className="add_modal studentAssignment"
      >
        <div className="flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-white">
            <span className="text-cyan">এসাইনমেন্ট</span> জমা দিন
          </h2>
          <form ref={formRef} onSubmit={handleSubmit} className="pb-5">
            <TextInput
              id="repo_link"
              type="url"
              label="গিটহাব রিপোসিটরি লিঙ্ক"
              required
              autoComplete="off"
              value={mutationData?.repo_link || ""}
              onChange={(e) =>
                validatedInputField(e.target.value) &&
                handleChange("repo_link", e.target.value)
              }
            />

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn ml-auto px-4 apply-btn mt-4"
              >
                জমা দিন
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default StudentAssignmentModal;
