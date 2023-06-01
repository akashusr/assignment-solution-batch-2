import { apiSlice } from "features/api/apiSlice";
import { size } from "lodash";

export const assignmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: () => "/assignments",
    }),
    getAssignment: builder.query({
      query: (id) => `/assignments/${id}`,
    }),
    addAssignment: builder.mutation({
      query: (data) => ({
        url: "/assignments",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newAssignment } = await queryFulfilled;

          // pessimistic updates cache
          dispatch(
            apiSlice.util.updateQueryData(
              "getAssignments",
              undefined,
              (draft) => {
                draft.push(newAssignment);
              }
            )
          );
        } catch {}
      },
    }),
    editAssignment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignments/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedAssignment } = await queryFulfilled;

          if (size(updatedAssignment)) {
            // pessimistic updates cache for assignments
            dispatch(
              apiSlice.util.updateQueryData(
                "getAssignments",
                undefined,
                (draft) => {
                  const assignmentIndex = draft?.findIndex(
                    (assignment) => parseInt(assignment?.id) === id
                  );
                  draft[assignmentIndex] = updatedAssignment;
                }
              )
            );

            // pessimistic updates cache for single assignment
            dispatch(
              apiSlice.util.updateQueryData("getAssignment", id, (draft) => {
                Object.assign(draft, updatedAssignment);
              })
            );
          }
        } catch {}
      },
    }),
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: "DELETE",
        body: id,
      }),
      onQueryStarted(args, { dispatch, queryFulfilled }) {
        // optimistic updates cache
        const result = dispatch(
          apiSlice.util.updateQueryData(
            "getAssignments",
            undefined,
            (draft) => {
              const updatedAssignments = draft?.filter(
                (assignment) => parseInt(assignment?.id) !== args
              );
              return updatedAssignments;
            }
          )
        );
        queryFulfilled.catch(result.undo);
      },
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentQuery,
  useAddAssignmentMutation,
  useEditAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentsApi;
