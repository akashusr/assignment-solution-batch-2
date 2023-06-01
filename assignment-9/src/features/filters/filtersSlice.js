import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProjectNames: [],
  searchKey: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    getProjectNames: (state, action) => {
      state.selectedProjectNames = action.payload;
    },
    filteredByProject: (state, action) => {
      const { isChecked, context } = action.payload;

      if (isChecked) {
        state.selectedProjectNames.push(context);
      } else {
        state.selectedProjectNames = state.selectedProjectNames?.filter(
          (name) => name !== context
        );
      }
    },
    searchFiltered: (state, action) => {
      state.searchKey = action.payload?.toLowerCase() || "";
    },
  },
});

export const { getProjectNames, searchFiltered, filteredByProject } =
  filtersSlice.actions;
export default filtersSlice.reducer;
