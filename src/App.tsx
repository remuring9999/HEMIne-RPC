import { useRef, useState } from "react";
import "./Styles/app.scss";
import MenuHeader from "./Components/Common/MenuHeader";
import Artwork from "./Elements/Main/Artwork";
import SongInfo from "./Components/Main/SongInfo";
import Player from "./Components/PlayerInterface/Player";
import Library from "./Layouts/Library";
import songData from "./Data/SongData";

function App() {
  let userDarkModeApplied = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const [uiState, setUiState] = useState({
    aboutShown: false,
    libraryShown: false,
    libraryPinned: false,
    darkMode: userDarkModeApplied ? true : false,
    coverSpinning: false,
    songPlaying: false,
    seekWidth: 0,
  });

  const [songState, setSongState] = useState({
    currentSong: [songData[0]],
    isPlaying: false,
    elapsed: 0,
    duration: 0,
  });

  document.body.style.backgroundImage = `url('${songState.currentSong[0].coverUrl}')`;

  const songEndHandler = async () => {
    let currentIndex = songData.findIndex(
      (song) => song === songState.currentSong[0]
    );
    await setSongState({
      ...songState,
      currentSong: [songData[(currentIndex + 1) % songData.length]],
    });
  };

  const songInfoHandler = (e: any) => {
    const elapsed = e.target.currentTime;
    const duration = e.target.duration;
    setSongState({
      ...songState,
      duration: duration,
      elapsed: elapsed,
    });
  };

  return (
    <div
      className={`app__wrapper ${uiState.darkMode ? "dark-mode" : "light-mode"
        }`}
      style={{
        backdropFilter: `${uiState.libraryShown || uiState.aboutShown
          ? "none"
          : "blur(1.5rem)"
          }`,
        WebkitBackdropFilter: `${uiState.libraryShown || uiState.aboutShown
          ? "none"
          : "blur(1.5rem)"
          }`,
      }}
    >
      <MenuHeader />
      <Artwork uiState={uiState} songState={songState} />
      <SongInfo songState={songState} />
      <Player
        seekWidth={uiState.seekWidth}
        uiState={uiState}
        setUiState={setUiState}
        songState={songState}
        setSongState={setSongState}
      />
      <Library
        uiState={uiState}
        setUiState={setUiState}
        songState={songState}
        setSongState={setSongState}
        songData={songData}
      />
    </div>
  );
}

export default App;