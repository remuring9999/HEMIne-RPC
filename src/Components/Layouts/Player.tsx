import PlayerControl from "../Main/PlayerControl";
import SeekControl from "../Main/SeekControl";

function Player({
  uiState,
  setUiState,
  songState,
  setSongState,
}: {
  uiState: UiState;
  setUiState: ReactSetAction<UiState>;
  songState: SongState;
  setSongState: ReactSetAction<SongState>;
}) {
  return (
    <div className="player">
      <SeekControl songState={songState} setSongState={setSongState} />
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
