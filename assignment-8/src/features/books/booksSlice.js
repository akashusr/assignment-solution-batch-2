const { createSlice } = require("@reduxjs/toolkit");

// initial state
const initialState = {
  searchKey: "",
  type: "all",
};

const bookSlice = createSlice({
  name: "booksFilter",
  initialState,
  reducers: {
    bookTypeChanged: (state, action) => {
      state.type = action.payload;
    },
    searchFiltered: (state, action) => {
      state.searchKey = action.payload?.toLowerCase() || "";
    },
  },
});

export const { bookTypeChanged, searchFiltered } = bookSlice.actions;
export default bookSlice.reducer;
