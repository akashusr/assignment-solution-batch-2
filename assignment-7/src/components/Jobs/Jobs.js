import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobList from "components/Jobs/JobList";
import {
  fetchJobs,
  jobSearchFiltered,
  jobSortChanged,
} from "features/jobs/jobsSlice";
import { size } from "lodash";
import warningMessage from "utils/warningMessage";
import { getJobHeaderTitle, getJobType } from "utils/AppHelpers";
import LoadingSpinner from "shared/LoadingSpinner";

const Jobs = () => {
  const dispatch = useDispatch();

  // selector
  const {
    isLoading,
    jobs,
    selectedType,
    searchKey,
    sort,
    isError,
    isDeleting,
  } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const jobFilterByType = (job) => {
    if (selectedType === "all_available") {
      return true;
    }
    return getJobType(job?.type) === selectedType;
  };

  const jobSortedBySalary = (a, b) => {
    if (sort?.salary === 1) {
      return parseFloat(a?.salary) - parseFloat(b?.salary);
    }
    if (sort?.salary === -1) {
      return parseFloat(b?.salary) - parseFloat(a?.salary);
    }
    return 0;
  };

  const jobSearchByTitle = (job) =>
    job?.title?.toLowerCase()?.includes(searchKey);

  return (
    <div className="lg:pl-[14rem]  mt-[5.8125rem]">
      <main className="max-w-3xl rounded-lg  mx-auto relative z-20 p-10 xl:max-w-none bg-[#1E293B]">
        <div className="md:flex space-y-2 md:space-y-0 justify-between mb-10 ">
          <h1 className="lws-section-title">
            {getJobHeaderTitle(selectedType)} Jobs
          </h1>
          <div className="flex gap-4">
            <div className="search-field group flex-1">
              <i className="fa-solid fa-magnifying-glass search-icon group-focus-within:text-blue-500"></i>
              <input
                type="text"
                placeholder="Search Job"
                className="search-input"
                id="lws-searchJob"
                value={searchKey || ""}
                onChange={(e) => dispatch(jobSearchFiltered(e.target.value))}
              />
            </div>
            <select
              id="lws-sort"
              name="sort"
              autoComplete="sort"
              className="flex-1"
              defaultValue={sort?.salary}
              onChange={(e) =>
                dispatch(jobSortChanged(parseInt(e.target.value)))
              }
            >
              <option value={0}>Default</option>
              <option value={1}>Salary (Low to High)</option>
              <option value={-1}>Salary (High to Low)</option>
            </select>
          </div>
        </div>

        <div className="jobs-list">
          {(() => {
            if (isLoading) {
              return <LoadingSpinner />;
            }
            if (isError) {
              return warningMessage("There was an error ocurred!");
            }
            if (size(jobs)) {
              if (
                size(
                  jobs
                    ?.filter(jobFilterByType)
                    .filter(jobSearchByTitle)
                    ?.sort(jobSortedBySalary)
                )
              ) {
                return jobs
                  ?.filter(jobFilterByType)
                  ?.filter(jobSearchByTitle)
                  ?.sort(jobSortedBySalary)
                  ?.map((job) => (
                    <JobList key={job?.id} job={job} isDeleting={isDeleting} />
                  ));
              }
              return warningMessage(
                "We're sorry. We cannot find any matches for your search term or filter."
              );
            }
            return warningMessage("We did not find anything to show here.");
          })()}
        </div>
      </main>
    </div>
  );
};

export default Jobs;
