import React, { useEffect, useRef, useState } from "react";
import { Modal, Textarea, TextInput } from "@mantine/core";
import {
  convertSecondsToDuration,
  convertToSeconds,
  toastAlert,
  validatedInputField,
} from "utils/AppHelpers";
import {
  useEditVideoMutation,
  useGetVideoQuery,
} from "features/admin/videos/videosApi";
import { size } from "lodash";
import { toast } from "react-toastify";
import ModalSpinner from "components/shared/ModalSpinner";

const EditVideoModal = ({
  videoId,
  openEditModal,
  setOpenEditModal,
  setVideoId,
}) => {
  const { data: video, isLoading: videoInfoLoading } =
    useGetVideoQuery(videoId);
  const [mutationData, setMutationData] = useState({});
  const formRef = useRef(null);
  const toastId = useRef(null);

  useEffect(() => {
    if (size(video)) {
      const { views, duration, createdAt, ...rest } = video;
      setMutationData({ ...rest, duration: convertToSeconds(duration) });
    }
  }, [video]);

  const handleChange = (type, value) => {
    setMutationData((prevData) => ({
      ...prevData,
      [type]: value,
    }));
  };

  const handleCloseModal = () => {
    setVideoId();
    setMutationData({});
    setOpenEditModal(false);
  };

  // edit video
  const [editVideo, { isLoading }] = useEditVideoMutation();
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.dismiss(toastId.current);

    const updatedData = {
      ...mutationData,
      duration: convertSecondsToDuration(mutationData?.duration),
    };
    delete updatedData.id;

    if (size(updatedData)) {
      editVideo({ id: mutationData?.id, data: updatedData })
        .unwrap()
        .then((res) => {
          if (size(res)) {
            toastAlert("success", "Updated successfully!");
            handleCloseModal();
            formRef.current.reset();
          }
        })
        .catch((error) => toastAlert("error", error?.data || error?.error));
    }
  };

  return (
    <>
      <Modal
        opened={openEditModal}
        onClose={handleCloseModal}
        title=" "
        size="lg"
        overlayProps={{
          bg: "rgb(15, 23, 42)",
        }}
        className="add_modal"
      >
        {(() => {
          if (!videoInfoLoading && size(mutationData)) {
            return (
              <div className="flex flex-col space-y-6">
                <h2 className="text-2xl font-bold text-white">Edit Video</h2>
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
            );
          }
          return <ModalSpinner />;
        })()}
      </Modal>
    </>
  );
};

export default EditVideoModal;
