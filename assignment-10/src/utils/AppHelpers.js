import { Tooltip } from "@mantine/core";
import { size } from "lodash";
import { toast } from "react-toastify";

export const validatedInputField = (value) => value?.indexOf(" ") !== 0;

// toast position
const position = {
  theme: "dark",
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 3000,
};

// alert message
export const toastAlert = (type, value) => {
  if (type === "success") {
    toast.success(value, position);
  } else if (type === "error") {
    toast.error(value, position);
  } else if (type === "warning") {
    toast.warning(value, position);
  }
};

export const convertSecondsToDuration = (totalSeconds) => {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  if (hours) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
};

export const convertToSeconds = (timeStr = "0:0") => {
  const times = timeStr.split(":");

  if (size(times) > 2) {
    const [hours, minutes, seconds] = times?.map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  const [minutes, seconds] = times?.map(Number);
  return minutes * 60 + seconds;
};

export const getAssignmentMarks = (data) => {
  const filteredMarks = data?.reduce((accumulate, current) => {
    const { student_id, student_name, mark } = current;

    const exitingStudent = accumulate?.some(
      (item) => item?.student_id === current?.student_id
    );

    if (!exitingStudent) {
      return [
        ...accumulate,
        {
          student_id: student_id,
          student_name: student_name,
          assignmentMarks: mark,
        },
      ];
    }
    return accumulate?.map((item) => {
      if (item?.student_id === current?.student_id) {
        return {
          ...item,
          assignmentMarks: item?.assignmentMarks + mark,
        };
      }
      return item;
    });
  }, []);
  return filteredMarks;
};

export const getQuizMarks = (data) => {
  const filteredMarks = data?.reduce((accumulate, current) => {
    const { student_id, student_name, mark } = current;

    const exitingStudent = accumulate?.some(
      (item) => item?.student_id === current?.student_id
    );

    if (!exitingStudent) {
      return [
        ...accumulate,
        {
          student_id: student_id,
          student_name: student_name,
          quizMarks: mark,
        },
      ];
    }
    return accumulate?.map((item) => {
      if (item?.student_id === current?.student_id) {
        return {
          ...item,
          quizMarks: item?.quizMarks + mark,
        };
      }
      return item;
    });
  }, []);
  return filteredMarks;
};

export const appToolTip = (
  description = "",
  sliceLength = 50,
  position = "left"
) => (
  <Tooltip
    label={description}
    multiline
    width={220}
    position={position}
    transitionProps={{ transition: "scale-x", duration: 300 }}
    color="dark"
    withArrow
  >
    <span className="text-ellipsis">
      {description?.slice(0, sliceLength)}...
    </span>
  </Tooltip>
);

export const warningText =
  "আপনি কি নিশ্চিত যে আসলেই সাবমিট করতে চাচ্ছেন? সাবমিট করার পর আর উত্তর পরিবর্তন করতে পারবেন না।";
