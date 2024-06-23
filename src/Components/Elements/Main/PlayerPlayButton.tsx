import { RiPlayFill } from "react-icons/ri";
import { IoIosPause } from "react-icons/io";
import shadow from "../../../Utils/Shadows";
import colors from "../../../Utils/Colors";
import gradients from "../../../Utils/Gradients";

function PlayerPlayButton({
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
  const currentPalette = songState.currentSong[0].palette;
  const playPauseHandler = () => {
    setUiState({ ...uiState, songPlaying: !uiState.songPlaying });
    if (uiState.songPlaying === true) {
      setSongState({ ...songState, isPlaying: false });
    } else {
      setSongState({ ...songState, isPlaying: true });
    }
  };

  const PlayPauseButton = () => {
    if (uiState.songPlaying) {
      return (
        <IoIosPause className="player__control-icon player__control-icon--white" />
      );
    } else {
      return (
        <RiPlayFill className="player__control-icon player__control-icon--white" />
      );
    }
  };

  return (
    <div
      className="player__control--play-button"
      onClick={playPauseHandler}
      style={{
        boxShadow: `${shadow(
          0,
          0,
          15,
          0,
          colors[`${currentPalette as keyof typeof colors}`]
        )}`,
        background: `${
          gradients[`${currentPalette as keyof typeof gradients}`]
        }`,
      }}
    >
      <PlayPauseButton />
    </div>
  );
}

export default PlayerPlayButton;
