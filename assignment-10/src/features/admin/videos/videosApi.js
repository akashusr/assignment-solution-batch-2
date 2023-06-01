import { apiSlice } from "features/api/apiSlice";
import { size } from "lodash";

export const videosApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: () => "/videos",
    }),
    getVideo: builder.query({
      query: (id) => `/videos/${id}`,
    }),
    addVideo: builder.mutation({
      query: (data) => ({
        url: "/videos",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newVideo } = await queryFulfilled;

          // pessimistic updates cache
          dispatch(
            apiSlice.util.updateQueryData("getVideos", undefined, (draft) => {
              draft.push(newVideo);
            })
          );
        } catch {}
      },
    }),
    editVideo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/videos/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedVideo } = await queryFulfilled;

          if (size(updatedVideo)) {
            // pessimistic updates cache for videos
            dispatch(
              apiSlice.util.updateQueryData("getVideos", undefined, (draft) => {
                const videoIndex = draft?.findIndex(
                  (video) => parseInt(video?.id) === id
                );
                draft[videoIndex] = updatedVideo;
              })
            );

            // pessimistic updates cache for single video
            dispatch(
              apiSlice.util.updateQueryData("getVideo", id, (draft) => {
                Object.assign(draft, updatedVideo);
              })
            );
          }
        } catch {}
      },
    }),
    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}`,
        method: "DELETE",
        body: id,
      }),
      onQueryStarted(args, { dispatch, queryFulfilled }) {
        // optimistic updates cache
        const result = dispatch(
          apiSlice.util.updateQueryData("getVideos", undefined, (draft) => {
            const updatedVideos = draft?.filter(
              (video) => parseInt(video?.id) !== args
            );

            return updatedVideos;
          })
        );
        queryFulfilled.catch(result.undo);
      },
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoQuery,
  useAddVideoMutation,
  useEditVideoMutation,
  useDeleteVideoMutation,
} = videosApi;
