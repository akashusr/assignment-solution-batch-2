import { apiSlice } from "features/api/apiSlice";

export const quizMarkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentQuizMarks: builder.query({
      query: () => "/quizMark",
    }),
    getStudentQuizMark: builder.query({
      query: ({ sid, vid }) => `/quizMark?student_id=${sid}&video_id=${vid}`,
    }),
    submitQuiz: builder.mutation({
      query: (data) => ({
        url: "/quizMark",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(
        { student_id, video_id },
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data: newQuizMark } = await queryFulfilled;

          // pessimistic updates cache for current student
          dispatch(
            apiSlice.util.updateQueryData(
              "getStudentQuizMark",
              { sid: student_id, vid: video_id },
              (draft) => {
                draft.push(newQuizMark);
              }
            )
          );

          // pessimistic updates cache for all the student
          dispatch(
            apiSlice.util.updateQueryData(
              "getStudentQuizMarks",
              undefined,
              (draft) => {
                draft.push(newQuizMark);
              }
            )
          );
        } catch {}
      },
    }),
  }),
});

export const {
  useGetStudentQuizMarkQuery,
  useGetStudentQuizMarksQuery,
  useSubmitQuizMutation,
} = quizMarkApi;
