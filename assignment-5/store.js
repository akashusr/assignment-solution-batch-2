const { configureStore } = require("@reduxjs/toolkit");
const { createLogger } = require("redux-logger");
const videoReducer = require("./videoSlice");
const relatedReducer = require("./relatedVideosSlice");

// logger
const logger = createLogger();

// configure store
const store = configureStore({
  reducer: {
    video: videoReducer,
    relatedVideos: relatedReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

module.exports = store;
