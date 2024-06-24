import { useState } from "react";

import MenuHeader from "../Components/Common/MenuHeader";
import Artwork from "../Components/Elements/Main/Artwork";
import SongInfo from "../Components/Main/SongInfo";
import Player from "../Components/Layouts/Player";
import Library from "../Components/Layouts/Library";
import TitleBar from "../Components/Main/TitleBar";
import Discord from "../Components/Elements/Main/Discord";
import Notification from "../Components/Function/Notification";

import songData from "../Data/SongData";
import "../Styles/Home.scss";

function Home() {
  let userDarkModeApplied = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const [uiState, setUiState] = useState<UiState>({
    libraryShown: false,
    libraryPinned: false,
    darkMode: userDarkModeApplied ? true : false,
    coverSpinning: false,
    songPlaying: false,
    seekWidth: 0,
  });

  const [songState, setSongState] = useState<SongState>({
    currentSong: [songData[0]],
    isPlaying: false,
    elapsed: 0,
    duration: 0,
  });

  window.electron.ipcReceive("login", async (data) => {
    const alert = await Notification(userDarkModeApplied ? true : false);
    alert.fire({
      icon: "success",
      title: `반갑다네 ${data.username} !`,
      timer: 5000,
      timerProgressBar: true,
    });
    localStorage.setItem("discordUser", JSON.stringify(data));
  });

  document.body.style.backgroundImage = `url('${songState.currentSong[0].coverUrl}')`;
  return (
    <div
      className={`app__wrapper ${
        uiState.darkMode ? "dark-mode" : "light-mode"
      }`}
      style={{
        backdropFilter: `${uiState.libraryShown ? "none" : "blur(1.5rem)"}`,
        WebkitBackdropFilter: `${
          uiState.libraryShown ? "none" : "blur(1.5rem)"
        }`,
      }}
    >
      <TitleBar />
      <MenuHeader />
      <Artwork uiState={uiState} songState={songState} />
      <SongInfo songState={songState} />
      <Player
        uiState={uiState}
        setUiState={setUiState}
        songState={songState}
        setSongState={setSongState}
      />
      <Library
        uiState={uiState}
        setUiState={setUiState}
        songState={songState}
        songData={songData}
      />
      <Discord rpcConnected={false} />
    </div>
  );
}

export default Home;
