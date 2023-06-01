import React, { useRef, useState } from "react";
import moment from "moment";
import { useEditAssignmentMarkMutation } from "features/admin/assignment-mark/assignmentApi";
import { size } from "lodash";
import { appToolTip, toastAlert } from "utils/AppHelpers";
import { toast } from "react-toastify";

const AssignmentMark = ({ assignment }) => {
  const {
    id,
    title,
    student_name,
    status,
    repo_link,
    createdAt,
    mark,
    totalMark,
  } = assignment;
  const [assignmentMark, setAssignmentMark] = useState(totalMark || 0);
  const toastId = useRef(null);

  const isMarkSent = status === "published";

  const handleChange = (value) => {
    const updatedMark = value ? parseFloat(value) : "";
    if (totalMark >= updatedMark) {
      setAssignmentMark(updatedMark);
    } else {
      setAssignmentMark(totalMark);
    }
  };

  // update assignment mark
  const [editAssignmentMark, { isLoading }] = useEditAssignmentMarkMutation();
  const handleUpdateMark = (assignmentMarkId) => {
    toast.dismiss(toastId.current);
    const updatedData = { mark: assignmentMark || 0, status: "published" };

    if (id && size(updatedData)) {
      editAssignmentMark({
        id: assignmentMarkId,
        data: updatedData,
      })
        .unwrap()
        .then((res) => {
          if (size(res)) {
            toastAlert("success", "Mark added successfully!");
          }
        })
        .catch((err) => toastAlert("error", err?.data || err?.error));
    }
  };

  //   disable apply button
  const disabledBtn = assignmentMark < 0 || assignmentMark === "";

  return (
    <tr>
      <td className="table-td">{title}</td>
      <td className="table-td">
        {createdAt && moment(createdAt).format("D MMM YYYY h:mm:ss A")}
      </td>
      <td className="table-td">{student_name}</td>
      <td className="table-td">
        {repo_link && (
          <a href={repo_link} target="_blank" rel="noreferrer">
            {appToolTip(repo_link, 40, "top-start")}
          </a>
        )}
      </td>
      <td className={`table-td ${!isMarkSent && "input-mark"}`}>
        {isMarkSent ? (
          mark
        ) : (
          <>
            <input
              type="number"
              min="0"
              max={totalMark || 100}
              value={assignmentMark}
              onChange={(e) => handleChange(e.target.value)}
            />
            <button
              disabled={isLoading || disabledBtn}
              onClick={() => handleUpdateMark(id)}
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-green-500 hover:text-green-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default AssignmentMark;
