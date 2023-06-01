import { apiSlice } from "features/api/apiSlice";

export const coursePlayerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignmentMark: builder.query({
      query: ({ sid, aid }) =>
        `/assignmentMark/?student_id=${sid}&assignment_id=${aid}`,
    }),
    getStudentQuizzes: builder.query({
      query: (videoId) => `/quizzes?video_id=${videoId}`,
    }),
    submitAssignment: builder.mutation({
      query: (data) => ({
        url: "/assignmentMark",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(
        { student_id, assignment_id },
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data: newAssignmentMark } = await queryFulfilled;

          // pessimistic updates cache
          dispatch(
            apiSlice.util.updateQueryData(
              "getAssignmentMark",
              { sid: student_id, aid: assignment_id },
              (draft) => {
                draft.push(newAssignmentMark);
              }
            )
          );

          // pessimistic updates cache for all assignment marks
          dispatch(
            apiSlice.util.updateQueryData(
              "getAssignmentMarks",
              undefined,
              (draft) => {
                draft.push(newAssignmentMark);
              }
            )
          );
        } catch {}
      },
    }),
  }),
});

export const {
  useGetAssignmentMarkQuery,
  useGetStudentQuizzesQuery,
  useSubmitAssignmentMutation,
} = coursePlayerApi;
