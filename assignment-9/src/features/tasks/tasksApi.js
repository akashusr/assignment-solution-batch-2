import { apiSlice } from "features/api/apiSlice";
import { size } from "lodash";

export const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "/tasks",
      providesTags: [""],
    }),
    getTask: builder.query({
      query: (id) => `/tasks/${id}`,
    }),
    addTask: builder.mutation({
      query: (data) => ({
        url: "/tasks",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newTask } = await queryFulfilled;

          // pessimistic updates cache
          dispatch(
            apiSlice.util.updateQueryData("getTasks", undefined, (draft) => {
              draft.push(newTask);
            })
          );
        } catch {}
      },
    }),
    editTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedTask } = await queryFulfilled;

          if (size(updatedTask)) {
            // pessimistic updates cache for tasks
            dispatch(
              apiSlice.util.updateQueryData("getTasks", undefined, (draft) => {
                const taskIndex = draft?.findIndex(
                  (task) => parseInt(task?.id) === id
                );
                draft[taskIndex] = updatedTask;
              })
            );

            // pessimistic updates cache for single task
            dispatch(
              apiSlice.util.updateQueryData(
                "getTask",
                id?.toString(),
                (draft) => {
                  Object.assign(draft, updatedTask);
                }
              )
            );
          }
        } catch {}
      },
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
        body: id,
      }),
      onQueryStarted(args, { dispatch, queryFulfilled }) {
        // optimistic updates cache
        const result = dispatch(
          apiSlice.util.updateQueryData("getTasks", undefined, (draft) => {
            const updatedTasks = draft?.filter(
              (task) => parseInt(task?.id) !== args
            );

            return updatedTasks;
          })
        );
        queryFulfilled.catch(result.undo);
      },
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
