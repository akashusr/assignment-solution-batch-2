import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignmentInfo: {},
  videoInfo: {},
};

const coursePlayerSlice = createSlice({
  name: "coursePlayer",
  initialState,
  reducers: {
    getStudentAssignment: (state, action) => {
      state.assignmentInfo = action.payload || {};
    },
    getStudentVideoInfo: (state, action) => {
      state.videoInfo = action.payload || {};
    },
  },
});

export const { getStudentVideoInfo, getStudentAssignment } =
  coursePlayerSlice.actions;
export default coursePlayerSlice.reducer;
