import { jobTypeChanged, removeJob } from "features/jobs/jobsSlice";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getJobTypeColor,
  numberWithCommas,
  toastAlert,
} from "utils/AppHelpers";

const JobList = ({ job, isDeleting }) => {
  const { id, title, type, salary, deadline } = job || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastId = useRef(null);

  const handleRemoveJob = (jobId) => {
    toast.dismiss(toastId.current);

    dispatch(removeJob(jobId)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        toastAlert("success", "Job deleted successfully!");
      } else if (res?.error?.code) {
        toastAlert("error", "Something went wrong! Please try again later.");
      }
    });
  };

  return (
    <div className="lws-single-job">
      <div className="flex-1 min-w-0">
        <h2 className="lws-title">{title}</h2>
        <div className="job-footers">
          <div className="lws-type">
            {/* <!-- Fulltime - #FF8A00,  --><!-- Internship - #FF5757,  --><!-- Remote - #56E5C4,  --> */}
            <i
              className={`fa-solid fa-stop !text-[${getJobTypeColor(
                type
              )}] text-lg mr-1.5`}
            ></i>
            {type}
          </div>
          <div className="lws-salary">
            <i className="fa-solid fa-bangladeshi-taka-sign text-slate-400 text-lg mr-1.5"></i>
            BDT {numberWithCommas(salary) || 0}
          </div>
          <div className="lws-deadline">
            <i className="fa-regular fa-calendar text-slate-400 text-lg mr-1.5"></i>
            Closing on {deadline}
          </div>
        </div>
      </div>

      <div className="mt-5 flex lg:mt-0 lg:ml-4">
        <span className="hidden sm:block">
          <button
            type="button"
            className="lws-edit btn btn-primary"
            onClick={() => {
              navigate(`jobs/edit/${id}`);
              dispatch(jobTypeChanged("all_available"));
            }}
          >
            <i className="fa-solid fa-pen text-gray-300 -ml-1 mr-2"></i>
            Edit
          </button>
        </span>

        <span className="sm:ml-3">
          <button
            type="button"
            disabled={isDeleting}
            className="lws-delete btn btn-danger "
            onClick={() => handleRemoveJob(id)}
          >
            <i className="fa-solid fa-trash text-gray-300 -ml-1 mr-2"></i>
            Delete
          </button>
        </span>
      </div>
    </div>
  );
};

export default JobList;
