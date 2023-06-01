import { changeJob, createJob, fetchSingleJob } from "features/jobs/jobsSlice";
import { size } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "shared/LoadingSpinner";
import { toastAlert } from "utils/AppHelpers";

const AddOrEditJob = () => {
  const { id } = useParams();
  const { updatingJobData, isAddingOrUpdating } = useSelector(
    (state) => state.jobs
  );
  const dispatch = useDispatch();

  // state
  const [mutationData, setMutationData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const formRef = useRef(null);
  const toastId = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleJob(id)).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          setIsLoading(false);
        } else if (res?.error?.code) {
          toastAlert("error", "Something went wrong!");
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }
  }, [dispatch, id]);

  const resetAll = () => {
    setMutationData({});
  };

  useEffect(() => {
    if (updatingJobData?.id) {
      setMutationData(updatingJobData);
    } else {
      resetAll();
    }
  }, [updatingJobData]);

  const handleChange = (name, value) => {
    setMutationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddOrUpdateJob = (e) => {
    e.preventDefault();
    toast.dismiss(toastId.current);

    const updatedData = { ...mutationData };

    // mutations
    if (updatingJobData?.id) {
      delete updatedData.id;
      dispatch(changeJob({ id: updatingJobData?.id, data: updatedData })).then(
        (res) => {
          if (res?.meta?.requestStatus === "fulfilled") {
            toastAlert("success", "Updated successfully!");
            resetAll();
            formRef.current.reset();
            navigate("/");
          } else if (res?.error?.code) {
            toastAlert(
              "error",
              "Something went wrong! Please try again later."
            );
          }
        }
      );
    } else if (size(mutationData)) {
      dispatch(createJob(mutationData)).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          toastAlert("success", "Job created successfully!");
          resetAll();
          formRef.current.reset();
          navigate("/");
        } else if (res?.error?.code) {
          toastAlert("error", "Something went wrong! Please try again later.");
        }
      });
    }
  };

  return (
    <div className="lg:pl-[14rem] mt-[5.8125rem]">
      <main className="max-w-3xl rounded-lg mx-auto relative z-20 p-10 xl:max-w-none bg-[#1E293B]">
        {(() => {
          if (isLoading) {
            return <LoadingSpinner />;
          }
          return (
            <>
              <h1 className="mb-10 text-center lws-section-title">
                {updatingJobData?.id ? "Edit" : "Add New"} Job
              </h1>
              <div className="max-w-3xl mx-auto">
                <form
                  ref={formRef}
                  className="space-y-6"
                  onSubmit={handleAddOrUpdateJob}
                >
                  <div className="fieldContainer">
                    <label
                      htmlFor="lws-JobTitle"
                      className="text-sm font-medium text-slate-300"
                    >
                      Job Title
                    </label>
                    <select
                      id="lws-JobTitle"
                      name="lwsJobTitle"
                      required
                      value={mutationData?.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                    >
                      <option value="" hidden>
                        Select Job
                      </option>
                      <option>Software Engineer</option>
                      <option>Software Developer</option>
                      <option>Full Stack Developer</option>
                      <option>MERN Stack Developer</option>
                      <option>DevOps Engineer</option>
                      <option>QA Engineer</option>
                      <option>Product Manager</option>
                      <option>Social Media Manager</option>
                      <option>Senior Executive</option>
                      <option>Junior Executive</option>
                      <option>Android App Developer</option>
                      <option>IOS App Developer</option>
                      <option>Frontend Developer</option>
                      <option>Frontend Engineer</option>
                    </select>
                  </div>

                  <div className="fieldContainer">
                    <label htmlFor="lws-JobType">Job Type</label>
                    <select
                      id="lws-JobType"
                      name="lwsJobType"
                      required
                      value={mutationData?.type || ""}
                      onChange={(e) => handleChange("type", e.target.value)}
                    >
                      <option value="" hidden>
                        Select Job Type
                      </option>
                      <option>Full Time</option>
                      <option>Internship</option>
                      <option>Remote</option>
                    </select>
                  </div>

                  <div className="fieldContainer">
                    <label htmlFor="lws-JobSalary">Salary</label>
                    <div className="flex border rounded-md shadow-sm border-slate-600">
                      <span className="input-tag">BDT</span>
                      <input
                        type="number"
                        name="lwsJobSalary"
                        id="lws-JobSalary"
                        min="0"
                        required
                        className="!rounded-l-none !border-0"
                        placeholder="20,00,000"
                        value={mutationData?.salary || ""}
                        onChange={(e) => handleChange("salary", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="fieldContainer">
                    <label htmlFor="lws-JobDeadline">Deadline</label>
                    <input
                      type="date"
                      name="lwsJobDeadline"
                      id="lws-JobDeadline"
                      required
                      value={mutationData?.deadline || ""}
                      onChange={(e) => handleChange("deadline", e.target.value)}
                    />
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={isAddingOrUpdating}
                      id="lws-submit"
                      className="btn btn-primary w-fit"
                    >
                      {(() => {
                        if (updatingJobData?.id) {
                          return isAddingOrUpdating ? "Updating" : "Update";
                        }
                        return isAddingOrUpdating ? "Saving" : "Save";
                      })()}
                    </button>
                  </div>
                </form>
              </div>
            </>
          );
        })()}
      </main>
    </div>
  );
};

export default AddOrEditJob;
