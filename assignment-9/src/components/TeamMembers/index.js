import React from "react";
import { useGetTeamQuery } from "features/team/teamApi";
import { size } from "lodash";
import Error from "utils/Error";

const TeamMembers = () => {
  const { data: team, isLoading, isError } = useGetTeamQuery();

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold">Team Members</h3>
      <div className="mt-3 space-y-4">
        {(() => {
          if (isLoading) {
            return <p className="m-2 text-center">Loading...</p>;
          }
          if (isError) {
            return (
              <p className="m-2 text-center">
                <Error />
              </p>
            );
          }
          if (size(team)) {
            return team?.map((member) => {
              const { id, name, avatar } = member;

              return (
                <div key={id} className="checkbox-container">
                  <img src={avatar} className="team-avater" alt="avatar" />
                  <p className="label">{name || ""}</p>
                </div>
              );
            });
          }
          return <p className="m-2 text-center">No member found!</p>;
        })()}
      </div>
    </div>
  );
};

export default TeamMembers;
