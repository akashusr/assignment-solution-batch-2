import { apiSlice } from "features/api/apiSlice";
import { size } from "lodash";

export const assignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignmentMarks: builder.query({
      query: () => "/assignmentMark",
    }),
    editAssignmentMark: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignmentMark/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedAssignmentMark } = await queryFulfilled;

          if (size(updatedAssignmentMark)) {
            // pessimistic updates cache for assignment mark
            dispatch(
              apiSlice.util.updateQueryData(
                "getAssignmentMarks",
                undefined,
                (draft) => {
                  const assignmentMarks = draft?.map((assignmentMark) => {
                    if (parseInt(assignmentMark?.id) === id) {
                      return { ...updatedAssignmentMark };
                    }
                    return assignmentMark;
                  });

                  return assignmentMarks;
                }
              )
            );
          }
        } catch {}
      },
    }),
  }),
});

export const { useGetAssignmentMarksQuery, useEditAssignmentMarkMutation } =
  assignmentApi;
