import React, { useEffect, useState } from "react";
import Navbar from "components/shared/Navbar";
import { useGetAssignmentMarksQuery } from "features/admin/assignment-mark/assignmentApi";
import { useGetStudentQuizMarksQuery } from "features/student/quiz/quizMarkApi";
import { cloneDeep, size } from "lodash";
import { useSelector } from "react-redux";
import LoadingSpinner from "components/shared/LoadingSpinner";
import TrophyIcon from "components/shared/icons/TrophyIcon";
import { getAssignmentMarks, getQuizMarks } from "utils/AppHelpers";

const currentUserData = {
  assignmentMarks: 0,
  quizMarks: 0,
  obtainedMarks: 0,
};

const LeaderBoard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: assignmentMarks, isSuccess: isSuccess1 } =
    useGetAssignmentMarksQuery();
  const { data: quizMarks, isSuccess: isSuccess2 } =
    useGetStudentQuizMarksQuery();
  const [currentUserInfo, setCurrentUserInfo] = useState(currentUserData);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      isSuccess1 &&
      isSuccess2 &&
      (size(assignmentMarks) || size(quizMarks))
    ) {
      const assignmentQuizMarks = [
        ...getAssignmentMarks(assignmentMarks),
        ...getQuizMarks(quizMarks),
      ];

      if (size(assignmentQuizMarks)) {
        const mergedAssignmentAndQuiz = cloneDeep(assignmentQuizMarks)?.reduce(
          (accumulate, currentValue) => {
            const exitingStudent = accumulate?.some(
              (item) => item?.student_id === currentValue?.student_id
            );

            if (!exitingStudent) {
              return [...accumulate, currentValue];
            }
            return accumulate?.map((item) => {
              if (item?.student_id === currentValue?.student_id) {
                return Object.assign(item, currentValue);
              }
              return item;
            });
          },
          []
        );

        if (size(mergedAssignmentAndQuiz)) {
          let rank = 0;
          const preparedAssignmentQuizMarks = mergedAssignmentAndQuiz
            ?.map((item) => ({
              ...item,
              obtainedMarks:
                (item?.assignmentMarks || 0) + (item?.quizMarks || 0),
            }))
            ?.sort((a, b) => b?.obtainedMarks - a?.obtainedMarks)
            ?.reduce((acc, currentValue) => {
              const sameRankElement = acc?.find(
                (item) => item?.obtainedMarks === currentValue?.obtainedMarks
              );
              if (!size(sameRankElement)) {
                rank++;
                return [...acc, { rank, ...currentValue }];
              }
              return [...acc, { rank: sameRankElement?.rank, ...currentValue }];
            }, []);

          if (size(preparedAssignmentQuizMarks)) {
            const currentStudentInfo = preparedAssignmentQuizMarks?.find(
              (item) => item?.student_id === user?.id
            );

            if (size(currentStudentInfo)) {
              setCurrentUserInfo(currentStudentInfo);
              setStudents(preparedAssignmentQuizMarks);
            } else {
              const lastStudent = preparedAssignmentQuizMarks?.slice(-1)[0];
              const userRank =
                lastStudent?.obtainedMarks > 0
                  ? lastStudent?.rank + 1
                  : lastStudent?.rank;
              setCurrentUserInfo((prev) => ({ rank: userRank, ...prev }));
              setStudents([
                ...preparedAssignmentQuizMarks,
                {
                  rank: userRank,
                  student_id: user?.id,
                  student_name: user?.name,
                  ...currentUserData,
                },
              ]);
            }
          }
        }
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isSuccess1, isSuccess2, quizMarks, assignmentMarks, user]);

  const td = (value) => (
    <td className="table-td text-center font-bold">{value}</td>
  );

  return (
    <>
      <Navbar />

      {/* main body */}
      <section className="py-6 bg-primary">
        <div className="mx-auto max-w-7xl px-5 lg:px-0">
          <div>
            <h3 className="text-lg font-bold">Your Position in Leaderboard</h3>
            <table className="text-base w-full border border-slate-600/50 rounded-md my-4">
              <thead>
                <tr>
                  <th className="table-th !text-center">Rank</th>
                  <th className="table-th !text-center">Name</th>
                  <th className="table-th !text-center">Quiz Mark</th>
                  <th className="table-th !text-center">Assignment Mark</th>
                  <th className="table-th !text-center">Total</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-2 border-cyan">
                  <td className="table-td text-center font-bold">
                    {currentUserInfo?.rank || 1}
                  </td>
                  <td className="table-td text-center font-bold">
                    {user?.name}
                  </td>
                  <td className="table-td text-center font-bold">
                    {currentUserInfo?.quizMarks || 0}
                  </td>
                  <td className="table-td text-center font-bold">
                    {currentUserInfo?.assignmentMarks || 0}
                  </td>
                  <td className="table-td text-center font-bold">
                    {currentUserInfo?.obtainedMarks || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="my-8">
            <h3 className="text-lg font-bold">Top 20 Result</h3>
            <table className="text-base w-full border border-slate-600/50 rounded-md my-4">
              <thead>
                <tr className="border-b border-slate-600/50">
                  <th className="table-th !text-center">Rank</th>
                  <th className="table-th !text-center">Name</th>
                  <th className="table-th !text-center">Quiz Mark</th>
                  <th className="table-th !text-center">Assignment Mark</th>
                  <th className="table-th !text-center">Total</th>
                </tr>
              </thead>

              <tbody>
                {(() => {
                  if (isLoading) {
                    return (
                      <tr>
                        <td>
                          <LoadingSpinner />
                        </td>
                      </tr>
                    );
                  }
                  if (size(students)) {
                    return students?.slice(0, 20)?.map((student) => {
                      const {
                        rank,
                        student_id,
                        student_name,
                        quizMarks,
                        assignmentMarks,
                        obtainedMarks,
                      } = student;

                      return (
                        <tr
                          key={student_id}
                          className="border-b border-slate-600/50"
                        >
                          {td(rank === 1 ? <TrophyIcon /> : rank)}
                          {td(student_name)}
                          {td(quizMarks || 0)}
                          {td(assignmentMarks || 0)}
                          {td(obtainedMarks || 0)}
                        </tr>
                      );
                    });
                  }
                  return (
                    <tr className="border-b border-slate-600/50">
                      {td(currentUserInfo?.rank || 1)}
                      {td(user?.name)}
                      {td(currentUserInfo?.quizMarks || 0)}
                      {td(currentUserInfo?.assignmentMarks || 0)}
                      {td(currentUserInfo?.obtainedMarks || 0)}
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default LeaderBoard;
