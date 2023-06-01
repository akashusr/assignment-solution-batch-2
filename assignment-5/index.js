const store = require("./store");
const { fetchVideo } = require("./videoSlice");
const { fetchRelatedVideos } = require("./relatedVideosSlice");

// subscribe to state changes
store.subscribe(() => {
  //   console.log(store.getState());
});

// dispatch actions
store
  .dispatch(fetchVideo())
  .then((action) => {
    const firstData = action.payload;
    const searchQueryString = firstData?.tags
      ?.map((tag) => `tags_like=${tag}`)
      ?.join("&");

    // related videos
    store.dispatch(fetchRelatedVideos(searchQueryString));
  })
  .catch((error) => {
    console.log("Error occurred while fetching data: ", error);
  });
