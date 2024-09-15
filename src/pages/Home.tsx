import { useEffect, useState } from "react";

import MenuHeader from "../Components/Common/MenuHeader";
import Artwork from "../Components/Elements/Main/Artwork";
import SongInfo from "../Components/Main/SongInfo";
import Player from "../Components/Layouts/Player";
import Library from "../Components/Layouts/Library";
import TitleBar from "../Components/Main/TitleBar";
import Discord from "../Components/Elements/Main/Discord";
import Notification from "../Components/Function/Notification";

import "../Styles/Home.scss";

function Home() {
  let userDarkModeApplied = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const [rpcConnected, setRpcConnected] = useState<boolean>(false);

  const [queueData, setQueueData] = useState<SongData[]>([]);

  const [songData, setSongData] = useState<SongData[]>([
    {
      title: "재생중인 음악이 없다네",
      artist: "햄이네",
      coverUrl: "",
      thumbUrl: "",
      palette: "coral",
      id: "1",
    },
  ]);

  const [songState, setSongState] = useState<SongState>({
    currentSong: [songData[0]],
    isPlaying: false,
    elapsed: 0,
    duration: 0,
  });

  const [uiState, setUiState] = useState<UiState>({
    libraryShown: false,
    libraryPinned: false,
    darkMode: userDarkModeApplied ? true : false,
    coverSpinning: false,
    songPlaying: false,
    seekWidth: 0,
  });

  useEffect(() => {
    const handleSongData = (json: PlayerData) => {
      if (json == null) {
        setSongData([
          {
            title: "재생중인 음악이 없다네",
            artist: "햄이네",
            coverUrl: "",
            thumbUrl: "",
            palette: "coral",
            id: "1",
          },
        ]);

        setSongState({
          currentSong: [
            {
              title: "재생중인 음악이 없다네",
              artist: "햄이네",
              coverUrl: "",
              thumbUrl: "",
              palette: "coral",
              id: "1",
            },
          ],
          isPlaying: false,
          elapsed: 0,
          duration: 0,
        });

        setUiState((prevState) => ({
          ...prevState,
          songPlaying: false,
        }));

        return;
      }

      setSongData([
        {
          title: json.data.Player.current.title,
          artist: json.data.Player.current.author,
          coverUrl: json.data.Player.current.thumbnail,
          thumbUrl: json.data.Player.current.thumbnail,
          palette: "coral",
          id: "1",
        },
      ]);

      setSongState({
        currentSong: [
          {
            title: json.data.Player.current.title,
            artist: json.data.Player.current.author,
            coverUrl: json.data.Player.current.thumbnail,
            thumbUrl: json.data.Player.current.thumbnail,
            palette: "coral",
            id: "1",
          },
        ],
        isPlaying: json.data.Player.isPaused ? false : true,
        elapsed: Math.floor(json.data.Player.current.position / 1000),
        duration: Math.floor(json.data.Player.current.length / 1000),
      });

      setUiState((prevState) => ({
        ...prevState,
        songPlaying: json.data.Player.isPlaying,
      }));

      setQueueData(json.data.Player.queue);

      document.body.style.backgroundImage = `url('${json.data.Player.current.thumbnail}')`;
    };

    window.electron.ipcReceive("SONG_DATA", handleSongData);

    return () => {
      window.electron.ipcRemove("SONG_DATA");
    };
  }, []);

  window.electron.ipcReceive("LOGIN_SUCCESS", async (data) => {
    const alert = await Notification(userDarkModeApplied ? true : false);
    await alert.fire({
      icon: "success",
      title: `반갑다네 ${data.username} !`,
      timer: 5000,
      timerProgressBar: true,
    });
    localStorage.setItem("discordUser", JSON.stringify(data));
    await setTimeout(() => {
      window.electron.ipcSend("RPC_CONNECT", data);
    }, 1000);
    await setTimeout(() => {
      window.electron.ipcSend("WS_CONNECT", data);
    }, 3000);
  });

  window.electron.ipcReceive("RPC_CONNECT_SUCCESS", async () => {
    const alert = await Notification(userDarkModeApplied ? true : false);
    await alert.fire({
      icon: "success",
      title: "Discord Client에 연결되었다네",
      timer: 5000,
      timerProgressBar: true,
    });
    setRpcConnected(true);
    window.electron.ipcSend("CLIENT_AUTHORIZATION_GET");
  });

  window.electron.ipcReceive("RPC_CONNECT_ERROR", async (data) => {
    const alert = await Notification(userDarkModeApplied ? true : false);
    await alert.fire({
      icon: "error",
      title: data.error,
      text: data.message,
      timer: 5000,
      timerProgressBar: true,
      position: "top-right",
    });
  });

  window.electron.ipcReceive("RPC_DISCONNECTED", async () => {
    const alert = await Notification(userDarkModeApplied ? true : false);
    await alert.fire({
      icon: "error",
      title: "Discord Client 연결이 해제되었다네",
      timer: 5000,
      timerProgressBar: true,
    });
    setRpcConnected(false);
  });

  window.electron.ipcReceive("WS_CONNECTED", async () => {
    const alert = await Notification(userDarkModeApplied ? true : false);
    await alert.fire({
      icon: "success",
      title: "HEMIne에 연결되었다네",
      timer: 5000,
      timerProgressBar: true,
    });
  });

  window.electron.ipcReceive("WS_DISCONNECTED", async () => {
    const alert = await Notification(userDarkModeApplied ? true : false);
    await alert.fire({
      icon: "error",
      title: "HEMIne 연결이 해제되었다네",
      timer: 5000,
      timerProgressBar: true,
    });
  });

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
        songData={queueData}
      />
      <Discord rpcConnected={rpcConnected} />
    </div>
  );
}

export default Home;
