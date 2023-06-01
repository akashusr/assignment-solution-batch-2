import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { size } from "lodash";
import { useSelector } from "react-redux";
import Navbar from "components/shared/Navbar";
import VideoSidebar from "components/StudentPortal/CoursePlayer/VideoSidebar";
import ReactPlayer from "react-player";
import LoadingSpinner from "components/shared/LoadingSpinner";
import NothingToFound from "components/shared/NothingToFound";
import {
  useGetAssignmentMarkQuery,
  useGetStudentQuizzesQuery,
} from "features/student/course-player/coursePlayerApi";
import { useGetStudentQuizMarkQuery } from "features/student/quiz/quizMarkApi";
import StudentAssignmentModal from "components/StudentPortal/CoursePlayer/StudentAssignmentModal";
import moment from "moment";
import { Badge, Button, Card, Grid, Group, Text } from "@mantine/core";
import QuestionIcon from "components/shared/icons/questionIcon";

const CoursePlayer = () => {
  const { user } = useSelector((state) => state.auth);
  const { assignmentInfo, videoInfo } = useSelector(
    (state) => state.coursePlayer
  );
  const { data: assignmentMark } = useGetAssignmentMarkQuery(
    {
      sid: user?.id,
      aid: assignmentInfo?.id,
    },
    { skip: !assignmentInfo?.id }
  );
  const { data: quizMark } = useGetStudentQuizMarkQuery(
    {
      sid: user?.id,
      vid: videoInfo?.id,
    },
    {
      skip: !videoInfo?.id,
    }
  );
  const { data: quizzes } = useGetStudentQuizzesQuery(videoInfo?.id, {
    skip: !videoInfo?.id,
  });
  const [, setSearchParams] = useSearchParams({});
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);

  const isSubmittedQuiz = size(quizMark) > 0;

  const handleSearchQuery = (isReplace, title) => {
    const queryTitle = title?.split(" ")?.join("-")?.toLowerCase();

    if (isReplace) {
      setSearchParams({ video: queryTitle }, { replace: true });
    } else {
      setSearchParams({ video: queryTitle });
    }
  };

  return (
    <>
      <Navbar />

      {/* main body */}
      <section className="py-6 bg-primary course-sidebar">
        <div className="mx-auto max-w-7xl px-5 lg:px-0">
          <div className="grid grid-cols-3 gap-2 lg:gap-8">
            <div
              className={`col-span-full w-full space-y-8 lg:col-span-2 ${
                !size(videoInfo) ? "flex justify-center align-center" : ""
              }`}
            >
              {(() => {
                if (!size(videoInfo)) {
                  return <LoadingSpinner />;
                }
                if (size(videoInfo)) {
                  const { title, url, description, createdAt } = videoInfo;

                  return (
                    <>
                      <ReactPlayer
                        url={url || ""}
                        controls
                        playing
                        width="100%"
                        className="aspect-video height-auto"
                      />

                      <div>
                        <h1 className="text-lg font-semibold tracking-tight text-slate-100">
                          {title || ""}
                        </h1>
                        <h2 className=" pb-4 text-sm leading-[1.7142857] text-slate-400">
                          {createdAt &&
                            `Uploaded on ${moment(createdAt).format(
                              "Do MMMM YYYY"
                            )}`}
                        </h2>

                        <div className="flex gap-4">
                          {(() => {
                            if (size(assignmentInfo)) {
                              return (
                                <>
                                  <button
                                    className={
                                      "px-3 font-bold py-1 assignment-total-mark  text-white rounded-full text-sm cursor-default"
                                    }
                                  >
                                    {`সর্বমোট নাম্বার - ${assignmentInfo?.totalMark}`}
                                  </button>
                                  {(() => {
                                    if (size(assignmentMark)) {
                                      const { status, mark } =
                                        assignmentMark[0];

                                      return (
                                        <button
                                          className={`px-3 font-bold py-1 assignment-status-${status?.toLowerCase()} text-white rounded-full text-sm cursor-default`}
                                        >
                                          {`প্রাপ্ত নাম্বার - ${
                                            status === "published"
                                              ? mark
                                              : "PENDING"
                                          }`}
                                        </button>
                                      );
                                    }
                                    return (
                                      <button
                                        onClick={() =>
                                          setOpenAssignmentModal(true)
                                        }
                                        className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
                                      >
                                        এসাইনমেন্ট জমা দিন
                                      </button>
                                    );
                                  })()}
                                </>
                              );
                            }
                            return "";
                          })()}

                          {size(quizzes) ? (
                            <>
                              {!isSubmittedQuiz && (
                                <Link to={`/video-quiz/${videoInfo?.id}`}>
                                  <span className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary">
                                    কুইজে এ অংশগ্রহণ করুন
                                  </span>
                                </Link>
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        <p className="mt-4 text-sm text-slate-400 leading-6">
                          {description || ""}
                        </p>
                      </div>
                      {isSubmittedQuiz && (
                        <div className="mt-6">
                          <Grid>
                            <Grid.Col span={4}>
                              <Card shadow="sm" padding="lg" radius="md">
                                <Card.Section component="div">
                                  <div className="flex h-32 items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500 px-6 text-center">
                                    <span className="text-lg font-semibold text-white">
                                      {`Quiz Set ${videoInfo?.id} : Lesson ${videoInfo?.id}
                                    Quiz Set`}
                                    </span>
                                  </div>
                                </Card.Section>

                                <Group position="apart" mt="lg">
                                  <Text
                                    weight={500}
                                    className="text-1 text-xs font-semibold"
                                  >
                                    পরীক্ষার মোট নাম্বার
                                  </Text>
                                  <Badge
                                    bg="rgba(7, 89, 133, 0.35)"
                                    className="badge-color"
                                  >
                                    {quizMark[0]?.totalMark}
                                  </Badge>
                                </Group>

                                <Group position="apart" mt="lg">
                                  <Text
                                    weight={500}
                                    className="text-1 text-xs font-semibold"
                                  >
                                    পরীক্ষায় প্রাপ্ত নাম্বার
                                  </Text>
                                  <Badge
                                    bg="rgba(7, 89, 133, 0.35)"
                                    className="badge-color"
                                  >
                                    {quizMark[0]?.mark}
                                  </Badge>
                                </Group>

                                <Button
                                  variant="outline"
                                  className="quiz-btn-color mt-6 text-xs cursor-not-allow"
                                  fullWidth
                                  mt="md"
                                  radius="md"
                                  leftIcon={<QuestionIcon size="1rem" />}
                                >
                                  কুইজের উত্তর দেখুন
                                </Button>
                              </Card>
                            </Grid.Col>
                          </Grid>
                        </div>
                      )}
                    </>
                  );
                }
                return <NothingToFound customClass="pt-8 text-sm" />;
              })()}
            </div>

            {/* video sidebar */}
            <VideoSidebar
              assignmentMark={assignmentMark}
              handleSearchQuery={handleSearchQuery}
              setOpenAssignmentModal={setOpenAssignmentModal}
            />
          </div>
        </div>
      </section>

      {/* modals */}
      <StudentAssignmentModal
        openAssignmentModal={openAssignmentModal}
        setOpenAssignmentModal={setOpenAssignmentModal}
      />
    </>
  );
};

export default CoursePlayer;
