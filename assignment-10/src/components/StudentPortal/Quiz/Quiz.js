import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetStudentQuizzesQuery } from "features/student/course-player/coursePlayerApi";
import InfoIcon from "components/shared/icons/InfoIcon";
import Navbar from "components/shared/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "components/shared/LoadingSpinner";
import { isEqual, size } from "lodash";
import NothingToFound from "components/shared/NothingToFound";
import { changedAnswer, getQuestions } from "features/student/quiz/quizSlice";
import {
  useGetStudentQuizMarkQuery,
  useSubmitQuizMutation,
} from "features/student/quiz/quizMarkApi";
import { toastAlert, warningText } from "utils/AppHelpers";

const Quiz = () => {
  const { videoId } = useParams();
  const { auth, quizAndAnswer } = useSelector((state) => state);
  const { data: quizMark } = useGetStudentQuizMarkQuery(
    {
      sid: auth?.user?.id,
      vid: videoId,
    },
    {
      skip: !videoId,
    }
  );
  const { data: quizzes, isLoading } = useGetStudentQuizzesQuery(videoId, {
    skip: !videoId,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (size(quizMark)) {
      navigate("/leaderboard", { replace: true });
    }
  }, [quizMark, navigate]);

  useEffect(() => {
    if (size(quizzes)) {
      dispatch(getQuestions(quizzes));
    }
  }, [quizzes, dispatch]);

  const calculatedMarks = () => {
    let mark = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalMark = 0;

    quizAndAnswer?.forEach((question) => {
      let correctIndexes = [];
      let checkedIndexes = [];

      question?.options?.forEach((option, optionIndex) => {
        if (option?.isCorrect) correctIndexes.push(optionIndex);
        if (option?.checked) checkedIndexes.push(optionIndex);
      });

      if (isEqual(correctIndexes, checkedIndexes)) {
        mark += 5;
        totalCorrect++;
      } else {
        totalWrong++;
      }
      totalMark += 5;
    });

    return { totalCorrect, totalWrong, totalMark, mark };
  };

  // submit quiz
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  const handleSubmit = () => {
    const { user } = auth;
    const { video_id, video_title } = quizAndAnswer[0];

    const updatedData = {
      student_id: user?.id,
      student_name: user?.name,
      video_id,
      video_title,
      totalQuiz: size(quizAndAnswer),
      ...calculatedMarks(),
    };

    if (size(updatedData)) {
      if (window.confirm(warningText) === true) {
        submitQuiz(updatedData)
          .unwrap()
          .then((res) => {
            navigate("/leaderboard", { replace: true });
          })
          .catch((err) => toastAlert("error", err?.data || err?.error));
      }
    }
  };

  return (
    <>
      <Navbar />

      <section className="py-6 bg-primary">
        {(() => {
          if (isLoading) {
            return <LoadingSpinner />;
          }
          if (size(quizAndAnswer) && !size(quizMark)) {
            return (
              <div className="mx-auto max-w-7xl px-5 lg:px-0">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-white">
                    {`Quizzes for "${quizAndAnswer[0]?.video_title}"`}
                  </h1>
                  <p className="text-sm text-slate-200">
                    Each question contains 5 Mark
                  </p>
                </div>
                <div className="text-2 mt-10 flex items-center justify-end gap-1 text-xs">
                  <InfoIcon />
                  <span>
                    একটি প্রশ্নের একাধিক উত্তর হতে পারে &amp; ভুল সিলেকশনে কোন
                    নেগেটিভ মার্কিং নেই
                  </span>
                </div>
                <div className="space-y-8 mt-2">
                  {quizAndAnswer?.map((quiz, i) => {
                    const { id, question, options } = quiz;

                    return (
                      <div key={id} className="quiz">
                        <h4 className="question">{`Quiz ${
                          i + 1
                        } - ${question}`}</h4>
                        <form className="quizOptions">
                          {/* <!-- Options --> */}
                          {options?.map((item, index) => {
                            const { id: optionId, option, checked } = item;

                            return (
                              <label
                                key={optionId}
                                htmlFor={`option1_q_${i}_${index}`}
                              >
                                <input
                                  type="checkbox"
                                  id={`option1_q_${i}_${index}`}
                                  checked={checked}
                                  onChange={(e) =>
                                    dispatch(
                                      changedAnswer({
                                        questionIndex: i,
                                        optionIndex: index,
                                        value: e.target.checked,
                                      })
                                    )
                                  }
                                />
                                {option}
                              </label>
                            );
                          })}
                        </form>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  className="px-7 py-2 rounded-full bg-cyan block ml-auto mt-8 hover:opacity-90 active:opacity-100 active:scale-95"
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Submitting" : "Submit"}
                </button>
                <div className="text-2 flex items-center gap-1 justify-end text-xs mt-2">
                  <InfoIcon />
                  <span>জমা দেয়ার পর উত্তর পরিবর্তন করতে পারবেন না</span>
                </div>
              </div>
            );
          }
          return <NothingToFound customClass="pt-8 text-sm" />;
        })()}
      </section>
    </>
  );
};

export default Quiz;
