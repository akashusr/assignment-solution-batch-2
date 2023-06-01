import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

const initialState = [];

const quizSlice = createSlice({
  name: "quizAndAnswer",
  initialState,
  reducers: {
    getQuestions: (state, action) => {
      const updatedQuestionsWithAns = action.payload?.map((question) => ({
        ...question,
        options: question?.options?.map((option) => ({
          ...option,
          checked: false,
        })),
      }));

      return updatedQuestionsWithAns;
    },
    changedAnswer: (state, action) => {
      const { questionIndex, optionIndex, value } = action.payload;

      const questions = cloneDeep(state);
      questions[questionIndex].options[optionIndex].checked = value;

      return questions;
    },
  },
});

export const { getQuestions, changedAnswer } = quizSlice.actions;
export default quizSlice.reducer;
