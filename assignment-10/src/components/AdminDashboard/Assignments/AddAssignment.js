import React, { useRef, useState } from "react";
import { Modal, Select, TextInput } from "@mantine/core";
import { useGetVideosQuery } from "features/admin/videos/videosApi";
import { size } from "lodash";
import {
  useAddAssignmentMutation,
  useGetAssignmentsQuery,
} from "features/admin/assignments/assignmentsApi";
import { toastAlert, validatedInputField } from "utils/AppHelpers";
import { toast } from "react-toastify";

const AddAssignment = ({ openAddModal, setOpenAddModal }) => {
  const { data: videos } = useGetVideosQuery();
  const { data: assignments } = useGetAssignmentsQuery();
  const [mutationData, setMutationData] = useState({});
  const formRef = useRef(null);
  const toastId = useRef(null);

  const preparedVideos = videos?.map(({ id, title }) => ({
    id,
    value: id,
    label: title,
    disabled: assignments?.some((assignment) => assignment?.video_id === id),
  }));

  const handleChange = (type, value) => {
    setMutationData((prevData) => ({
      ...prevData,
      [type]: value,
    }));
  };

  const handleSelectVideo = (value) => {
    const video = preparedVideos?.find((video) => video?.id === value);
    if (size(video)) {
      setMutationData((prevData) => ({
        ...prevData,
        video_id: video?.id,
        video_title: video?.label,
      }));
    } else if (mutationData?.video_id) {
      setMutationData(
        ({ video_id, video_title, ...restPrevData }) => restPrevData
      );
    }
  };

  const handleCloseModal = () => {
    setOpenAddModal(false);
    formRef.current.reset();
    setMutationData({});
  };

  // add assignment
  const [addAssignment, { isLoading }] = useAddAssignmentMutation();
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.dismiss(toastId.current);

    const updatedData = {
      ...mutationData,
      totalMark: parseFloat(mutationData?.totalMark) || 0,
    };

    if (size(updatedData)) {
      addAssignment(updatedData)
        .unwrap()
        .then((res) => {
          if (size(res)) {
            toastAlert("success", "Assignment created successfully!");
            handleCloseModal();
          }
        })
        .catch((err) => toastAlert("error", err?.data || err?.error));
    }
  };

  return (
    <>
      <Modal
        opened={openAddModal}
        onClose={handleCloseModal}
        title=" "
        size="lg"
        overlayProps={{
          bg: "rgb(15, 23, 42)",
        }}
        className="add_modal"
      >
        <div className="flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-white">Add Assignment</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="pb-5">
            <TextInput
              id="title"
              type="text"
              label="Title"
              required
              placeholder="Enter title"
              autoComplete="off"
              value={mutationData?.title || ""}
              onChange={(e) =>
                validatedInputField(e.target.value) &&
                handleChange("title", e.target.value)
              }
            />
            <Select
              label="Video"
              placeholder="Select video"
              data={preparedVideos || []}
              onChange={handleSelectVideo}
              autoComplete="off"
              searchable
              clearable
              nothingFound="No options"
              required
            />
            <TextInput
              id="totalMark"
              type="number"
              label="Total Mark"
              required
              placeholder="Enter mark"
              autoComplete="off"
              value={mutationData?.totalMark || ""}
              onChange={(e) =>
                handleChange("totalMark", Math.abs(e.target.value))
              }
            />

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn ml-auto px-4 apply-btn mt-4"
              >
                {isLoading ? "Saving" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default AddAssignment;
