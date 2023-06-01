import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import Navbar from "components/shared/Navbar";
import { useGetVideosQuery } from "features/admin/videos/videosApi";
import LoadingSpinner from "components/shared/LoadingSpinner";
import Video from "components/AdminDashboard/Videos/Video";
import { size } from "lodash";
import NothingToFound from "components/shared/NothingToFound";
import { toastAlert } from "utils/AppHelpers";
import AddVideoModal from "components/AdminDashboard/Videos/AddVideoModal";
import EditVideoModal from "components/AdminDashboard/Videos/EditVideoModal";

const Videos = () => {
  const { data: videos, isLoading, isError, error } = useGetVideosQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [videoId, setVideoId] = useState();

  useEffect(() => {
    if (isError) {
      toastAlert("error", error?.data || error?.error);
    }
  }, [error, isError]);

  return (
    <>
      <Navbar />

      {/* main body */}
      <section className="py-6 bg-primary">
        <div className="mx-auto max-w-full px-5 lg:px-20">
          <div className="px-3 py-20 bg-opacity-10">
            <div className="w-full flex">
              <button type="button" className="btn ml-auto" onClick={open}>
                Add Video
              </button>
            </div>
            <div className="overflow-x-auto mt-4">
              {(() => {
                if (isLoading) {
                  return <LoadingSpinner />;
                }
                if (size(videos)) {
                  return (
                    <Video
                      videos={videos}
                      setOpenEditModal={setOpenEditModal}
                      setVideoId={setVideoId}
                    />
                  );
                }
                return <NothingToFound />;
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* add video modal */}
      <AddVideoModal opened={opened} close={close} />

      {/* edit video modal */}
      {videoId && (
        <EditVideoModal
          videoId={videoId}
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          setVideoId={setVideoId}
        />
      )}
    </>
  );
};

export default Videos;
