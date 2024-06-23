import {
  RiPlayListLine,
  RiSunLine,
  RiMoonLine,
  RiSkipBackLine,
  RiSkipForwardLine,
} from "react-icons/ri";
import PlayerPlayButton from "../Elements/Main/PlayerPlayButton";

function PlayerControl({
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
  const darkModeToggleHandler = () => {
    setUiState({ ...uiState, darkMode: !uiState.darkMode });
  };

  const libraryToggleHandler = () => {
    if (!window.visualViewport) return;
    if (window.visualViewport.width < 900) {
      setUiState({ ...uiState, libraryShown: true });
    }
  };

  const DarkModeButton = () => {
    if (!uiState.darkMode) {
      return (
        <RiMoonLine
          className="player__control-icon"
          onClick={darkModeToggleHandler}
        />
      );
    } else {
      return (
        <RiSunLine
          className="player__control-icon"
          onClick={darkModeToggleHandler}
        />
      );
    }
  };

  return (
    <div className="player__control">
      <RiPlayListLine
        className="player__control-icon disabled-on-desktop"
        onClick={libraryToggleHandler}
      />
      <RiSkipBackLine className="player__control-icon" />
      <PlayerPlayButton
        uiState={uiState}
        setUiState={setUiState}
        setSongState={setSongState}
        songState={songState}
      />
      <RiSkipForwardLine className="player__control-icon" />
      <DarkModeButton />
    </div>
  );
}

export default PlayerControl;
