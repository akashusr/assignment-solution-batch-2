import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "",
};

const taskSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    changedStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { changedStatus } = taskSlice.actions;
export default taskSlice.reducer;
