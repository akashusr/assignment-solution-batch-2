/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { size } from "lodash";
import { useGetAssignmentsQuery } from "features/admin/assignments/assignmentsApi";
import { useGetVideosQuery } from "features/admin/videos/videosApi";
import LoadingSpinner from "components/shared/LoadingSpinner";
import NothingToFound from "components/shared/NothingToFound";
import { Accordion, ScrollArea } from "@mantine/core";
import { mantineStyle } from "utils/customStyles";
import { MdAssignment } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudentAssignment,
  getStudentVideoInfo,
} from "features/student/course-player/coursePlayerSlice";

const VideoSidebar = ({
  assignmentMark,
  handleSearchQuery,
  setOpenAssignmentModal,
}) => {
  const { data: assignments } = useGetAssignmentsQuery();
  const { data: videos, isLoading } = useGetVideosQuery();
  const { videoInfo } = useSelector((state) => state.coursePlayer);
  const dispatch = useDispatch({});

  useEffect(() => {
    if (size(videos)) {
      const { id, title } = videos[0];
      const assignment = assignments?.find((item) => item?.video_id === id);

      // actions
      dispatch(getStudentAssignment(assignment));
      dispatch(getStudentVideoInfo(videos[0]));
      handleSearchQuery(false, title);
    }
  }, [videos, dispatch]);

  return (
    <div
      className={`col-span-full lg:col-auto bg-secondary p-4 rounded-md border border-slate-50/10 divide-y divide-slate-600/30 lg:h-[500px] ${
        isLoading ? "flex justify-center align-center" : ""
      }`}
    >
      {(() => {
        if (isLoading) {
          return <LoadingSpinner />;
        }
        if (size(videos) && videoInfo?.id) {
          return (
            <ScrollArea h={425} scrollbarSize={10}>
              <Accordion
                variant="contained"
                styles={mantineStyle}
                value={`${videoInfo?.id}-body`}
              >
                {videos?.map((video) => {
                  const { id, title, duration, views } = video;
                  const assignment = assignments?.find(
                    (item) => item?.video_id === id
                  );
                  const isSubmittedAssignment =
                    size(assignmentMark) &&
                    assignment?.id === assignmentMark[0]?.assignment_id;

                  return (
                    <Accordion.Item
                      key={id}
                      value={`${id}-body`}
                      className="bg-secondary"
                    >
                      <Accordion.Control
                        className="bg-secondary text-white"
                        onClick={() => {
                          dispatch(getStudentAssignment(assignment));
                          handleSearchQuery(true, title);
                          dispatch(getStudentVideoInfo(video));
                        }}
                      >
                        <div className="w-full flex flex-row gap-2 cursor-pointer">
                          {/* <!-- Thumbnail --> */}
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 text-secondary"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                            />
                          </svg>
                          {/* <!-- Description --> */}
                          <div className="flex flex-col w-full">
                            <p className="text-slate-50 text-sm font-medium">
                              {title}
                            </p>
                            <div>
                              <span className="text-gray-400 text-xs mt-1">
                                {duration &&
                                  `${duration} ${
                                    size(duration?.split(":")) === 2
                                      ? "Mins"
                                      : "Hrs"
                                  }`}
                              </span>
                              <span className="text-gray-400 text-xs mt-1">
                                {" "}
                                |{" "}
                              </span>
                              <span className="text-gray-400 text-xs mt-1">
                                {views || ""} views
                              </span>
                            </div>
                          </div>
                        </div>
                      </Accordion.Control>
                      <Accordion.Panel>
                        {(() => {
                          if (size(assignment)) {
                            const { title } = assignment;

                            return (
                              <div
                                role="button"
                                onClick={() =>
                                  !isSubmittedAssignment &&
                                  setOpenAssignmentModal(true)
                                }
                                className={`w-full flex flex-row gap-2 hover:bg-slate-900 p-2 px-5 border-general border-b py-3 last:border-none ${
                                  isSubmittedAssignment
                                    ? "cursor-default"
                                    : "cursor-pointer"
                                }`}
                              >
                                {/* <!-- Thumbnail --> */}
                                <MdAssignment className="w-5 h-5 text-secondary" />
                                {/* <!-- Description --> */}
                                <div className="flex flex-col w-full">
                                  <p className="text-slate-50 text-sm font-medium">
                                    {title}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                        })()}
                      </Accordion.Panel>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </ScrollArea>
          );
        }
        return <NothingToFound customClass="pt-8 text-sm" />;
      })()}
    </div>
  );
};

export default VideoSidebar;
