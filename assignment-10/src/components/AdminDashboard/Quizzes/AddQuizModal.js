import React, { useEffect, useRef, useState } from "react";
import { Checkbox, Input, Modal, Select, TextInput } from "@mantine/core";
import { useGetVideosQuery } from "features/admin/videos/videosApi";
import { size } from "lodash";
import { toastAlert, validatedInputField } from "utils/AppHelpers";
import { toast } from "react-toastify";
import { useAddQuizMutation } from "features/admin/quizzes/quizzesApi";
import { options } from "utils/uiData";

const AddQuizModal = ({ openAddModal, setOpenAddModal }) => {
  const { data: videos } = useGetVideosQuery();
  const [mutationData, setMutationData] = useState({});
  const [quizOptions, setQuizOptions] = useState(options);
  const formRef = useRef(null);
  const toastId = useRef(null);

  useEffect(() => {
    if (openAddModal) {
      setQuizOptions(options);
    }
  }, [openAddModal]);

  const preparedVideos = videos?.map(({ id, title }) => ({
    id,
    value: id,
    label: title,
  }));

  const selectedRightAns = quizOptions?.some(
    (item) => item?.isCorrect === true
  );

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

  const handleOptions = (context, value, id) => {
    setQuizOptions((prev) =>
      prev?.map((item) => {
        if (context === "input" && item?.id === id) {
          return { ...item, option: value };
        }
        if (item?.id === id) {
          return { ...item, isCorrect: value };
        }
        return item;
      })
    );
  };

  const handleCloseModal = () => {
    setOpenAddModal(false);
    formRef.current.reset();
    setMutationData({});
  };

  // add quiz
  const [addQuiz, { isLoading }] = useAddQuizMutation();
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.dismiss(toastId.current);

    const updatedData = { ...mutationData, options: quizOptions };

    if (size(updatedData)) {
      addQuiz(updatedData)
        .unwrap()
        .then((res) => {
          if (size(res)) {
            toastAlert("success", "Quiz added successfully!");
            handleCloseModal();
          }
        })
        .catch((error) => toastAlert("error", error?.data || error?.error));
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
          <h2 className="text-2xl font-bold text-white">Add Quiz</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="pb-5">
            <TextInput
              id="question"
              type="text"
              label="Question"
              required
              autoComplete="off"
              value={mutationData?.question || ""}
              onChange={(e) =>
                validatedInputField(e.target.value) &&
                handleChange("question", e.target.value)
              }
            />
            <Select
              label="Video"
              data={preparedVideos || []}
              onChange={handleSelectVideo}
              autoComplete="off"
              searchable
              clearable
              nothingFound="No options"
              required
            />
            <Input.Wrapper label="Select the right answer (options)" required>
              {quizOptions?.map((item) => {
                const { id, isCorrect } = item;

                return (
                  <div key={id} className="flex align-center mb-2 options">
                    <Checkbox
                      checked={isCorrect}
                      label="Option"
                      required={!selectedRightAns}
                      onChange={(e) => handleOptions("", e.target.checked, id)}
                    />
                    <Input
                      className="ml-4"
                      autoComplete="off"
                      required
                      onChange={(e) =>
                        handleOptions("input", e.target.value, id)
                      }
                    />
                  </div>
                );
              })}
            </Input.Wrapper>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn ml-auto px-4 apply-btn mt-6"
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

export default AddQuizModal;
