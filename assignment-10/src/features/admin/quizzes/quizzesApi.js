import { apiSlice } from "features/api/apiSlice";
import { size } from "lodash";

export const quizzesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      query: () => "/quizzes",
    }),
    getQuiz: builder.query({
      query: (id) => `/quizzes/${id}`,
    }),
    addQuiz: builder.mutation({
      query: (data) => ({
        url: "/quizzes",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newQuiz } = await queryFulfilled;

          // pessimistic updates cache
          dispatch(
            apiSlice.util.updateQueryData("getQuizzes", undefined, (draft) => {
              draft.push(newQuiz);
            })
          );
        } catch {}
      },
    }),
    editQuiz: builder.mutation({
      query: ({ id, data }) => ({
        url: `/quizzes/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedQuiz } = await queryFulfilled;

          if (size(updatedQuiz)) {
            // pessimistic updates cache for quizzes
            dispatch(
              apiSlice.util.updateQueryData(
                "getQuizzes",
                undefined,
                (draft) => {
                  const quizIndex = draft?.findIndex(
                    (quiz) => parseInt(quiz?.id) === id
                  );
                  draft[quizIndex] = updatedQuiz;
                }
              )
            );

            // pessimistic updates cache for single quiz
            dispatch(
              apiSlice.util.updateQueryData("getQuiz", id, (draft) => {
                Object.assign(draft, updatedQuiz);
              })
            );
          }
        } catch {}
      },
    }),
    deleteQuiz: builder.mutation({
      query: (id) => ({
        url: `/quizzes/${id}`,
        method: "DELETE",
        body: id,
      }),
      onQueryStarted(args, { dispatch, queryFulfilled }) {
        // optimistic updates cache
        const result = dispatch(
          apiSlice.util.updateQueryData("getQuizzes", undefined, (draft) => {
            const updatedQuizzes = draft?.filter(
              (quiz) => parseInt(quiz?.id) !== args
            );
            return updatedQuizzes;
          })
        );
        queryFulfilled.catch(result.undo);
      },
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useGetQuizQuery,
  useAddQuizMutation,
  useEditQuizMutation,
  useDeleteQuizMutation,
} = quizzesApi;
