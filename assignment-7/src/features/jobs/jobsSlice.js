import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addJob,
  deleteJob,
  getJobs,
  getSingleJob,
  updateJob,
} from "features/jobs/jobsAPI";

// initial state
const initialState = {
  jobs: [],
  isLoading: false,
  isError: false,
  isAddingOrUpdating: false,
  isDeleting: false,
  searchKey: "",
  selectedType: "all_available",
  sort: { salary: 0 },
  updatingJobData: {},
};

// async thunks
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const jobs = await getJobs();
  return jobs;
});

export const createJob = createAsyncThunk(
  "job/createJob",
  async (mutationData) => {
    const job = await addJob(mutationData);
    return job;
  }
);

export const fetchSingleJob = createAsyncThunk(
  "jobs/fetchSingleJob",
  async (id) => {
    const job = await getSingleJob(id);
    return job;
  }
);

export const changeJob = createAsyncThunk(
  "job/changeJob",
  async ({ id, data }) => {
    const job = await updateJob(id, data);
    return job;
  }
);

export const removeJob = createAsyncThunk("jobs/removeJob", async (id) => {
  const response = await deleteJob(id);
  return response;
});

// create slice
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    jobSearchFiltered: (state, action) => {
      state.searchKey = action.payload?.toLowerCase() || "";
    },
    jobSortChanged: (state, action) => {
      state.sort.salary = action.payload || 0;
    },
    jobTypeChanged: (state, action) => {
      state.selectedType = action.payload;
    },
    editInActive: (state) => {
      state.updatingJobData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.jobs = [];
      })
      .addCase(createJob.pending, (state) => {
        state.isError = false;
        state.isAddingOrUpdating = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isError = false;
        state.isAddingOrUpdating = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state) => {
        state.isAddingOrUpdating = false;
      })
      .addCase(fetchSingleJob.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(fetchSingleJob.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.updatingJobData = action.payload;
      })
      .addCase(fetchSingleJob.rejected, (state, action) => {
        state.isLoading = false;
        state.updatingJobData = {};
      })
      .addCase(changeJob.pending, (state) => {
        state.isError = false;
        state.isAddingOrUpdating = true;
      })
      .addCase(changeJob.fulfilled, (state, action) => {
        const updateJobs = state?.jobs?.map((job) => {
          if (job?.id === action.payload.id) {
            return { ...job, ...action.payload };
          }
          return job;
        });
        state.isError = false;
        state.isAddingOrUpdating = false;
        state.updatingJobData = {};
        state.jobs = updateJobs;
      })
      .addCase(changeJob.rejected, (state) => {
        state.isAddingOrUpdating = false;
      })
      .addCase(removeJob.pending, (state) => {
        state.isError = false;
        state.isDeleting = true;
      })
      .addCase(removeJob.fulfilled, (state, action) => {
        state.isError = false;
        state.isDeleting = false;
        state.jobs = state.jobs?.filter((job) => job?.id !== action.meta.arg);
      })
      .addCase(removeJob.rejected, (state) => {
        state.isDeleting = false;
      });
  },
});

export default jobsSlice.reducer;
export const {
  jobTypeChanged,
  jobSearchFiltered,
  jobSortChanged,
  editInActive,
} = jobsSlice.actions;
