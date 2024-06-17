import React from "react";
import PlayerControl from "../Main/PlayerControl";
import SeekControl from "../Main/SeekControl";
function Player({
  uiState,
  setUiState,
  songState,
  setSongState,
  seekWidth,
}: {
  uiState: any;
  setUiState: any;
  songState: any;
  setSongState: any;
  seekWidth: number; // Update the type of seekWidth to number
}) {
  return (
    <div className="player">
      <SeekControl
        songState={songState}
        setSongState={setSongState}
      />
      <PlayerControl
        uiState={uiState}
        songState={songState}
        setUiState={setUiState}
        setSongState={setSongState}
      />
    </div>
  );
}

export default Player;
