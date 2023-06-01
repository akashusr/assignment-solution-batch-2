const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const fetch = require("node-fetch");

// initial state
const initialState = { loading: false, videos: [], error: "" };

// create async thunk
const fetchRelatedVideos = createAsyncThunk(
  "relatedVideos/fetchRelatedVideos",
  async (searchQueryString) => {
    const response = await fetch(
      `http://localhost:9000/videos?${searchQueryString}`
    );
    const relatedVideos = await response.json();

    const sortedVideos = relatedVideos?.sort((a, b) =>
      parseFloat(a?.views) > parseFloat(b?.views) ? -1 : 1
    );

    return sortedVideos;
  }
);

const relatedVideosSlice = createSlice({
  name: "relatedVideos",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRelatedVideos.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(fetchRelatedVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.videos = action.payload;
    });

    builder.addCase(fetchRelatedVideos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
      state.videos = [];
    });
  },
});

module.exports = relatedVideosSlice.reducer;
module.exports.fetchRelatedVideos = fetchRelatedVideos;
