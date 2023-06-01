import React, { useRef, useState } from "react";
import { Modal, Textarea, TextInput } from "@mantine/core";
import {
  convertSecondsToDuration,
  toastAlert,
  validatedInputField,
} from "utils/AppHelpers";
import moment from "moment/moment";
import { useAddVideoMutation } from "features/admin/videos/videosApi";
import { size } from "lodash";
import { toast } from "react-toastify";

const AddVideoModal = ({ opened, close }) => {
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
    close();
    formRef.current.reset();
    setMutationData({});
  };

  // add video
  const [addVideo, { isLoading }] = useAddVideoMutation();
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.dismiss(toastId.current);

    const updatedData = {
      ...mutationData,
      views: Intl.NumberFormat("en", {
        notation: "compact",
      }).format(mutationData?.views),
      duration: convertSecondsToDuration(mutationData?.duration),
      createdAt: moment().format(),
    };

    if (size(updatedData)) {
      addVideo(updatedData)
        .unwrap()
        .then((res) => {
          if (size(res)) {
            toastAlert("success", "Video added successfully!");
            handleCloseModal();
          }
        })
        .catch((error) => toastAlert("error", error?.data || error?.error));
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title=" "
        size="lg"
        overlayProps={{
          bg: "rgb(15, 23, 42)",
        }}
        className="add_modal"
      >
        <div className="flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-white">Add Video</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="pb-5">
            <TextInput
              id="title"
              type="text"
              label="Title"
              required
              placeholder="Enter title"
              value={mutationData?.title || ""}
              autoComplete="off"
              onChange={(e) =>
                validatedInputField(e.target.value) &&
                handleChange("title", e.target.value)
              }
            />
            <TextInput
              id="link"
              type="url"
              label="Link"
              required
              placeholder="Enter url"
              value={mutationData?.url || ""}
              autoComplete="off"
              onChange={(e) =>
                validatedInputField(e.target.value) &&
                handleChange("url", e.target.value)
              }
            />
            <TextInput
              id="views"
              type="number"
              label="Views (In numbers)"
              required
              placeholder="Enter views"
              value={mutationData?.views || ""}
              autoComplete="off"
              onChange={(e) => handleChange("views", Math.abs(e.target.value))}
            />
            <TextInput
              id="duration"
              type="number"
              label="Duration (In seconds)"
              required
              placeholder="Enter duration"
              value={mutationData?.duration || ""}
              autoComplete="off"
              onChange={(e) =>
                handleChange("duration", Math.abs(e.target.value))
              }
            />
            <Textarea
              id="description"
              type="text"
              label="Description"
              required
              placeholder="Write description..."
              value={mutationData?.description || ""}
              autoComplete="off"
              autosize
              minRows={3}
              onChange={(e) =>
                validatedInputField(e.target.value) &&
                handleChange("description", e.target.value)
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

export default AddVideoModal;
