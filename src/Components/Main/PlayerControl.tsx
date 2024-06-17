import React, { useRef } from "react";
import {
    RiPlayListLine,
    RiSunLine,
    RiMoonLine,
    RiSkipBackLine,
    RiSkipForwardLine,
} from "react-icons/ri";
import songData from "../../Data/SongData";
import PlayerPlayButton from "../../Elements/Main/PlayerPlayButton";

function PlayerControl({
    uiState,
    setUiState,
    songState,
    setSongState,
}: {
    uiState: any;
    setUiState: any;
    songState: any;
    setSongState: any;
}
) {
    let currentIndex = songData.findIndex(
        (song) => song === songState.currentSong[0]
    );

    const previousSongHandler = () => {
        setTimeout(() => {
            if ((currentIndex - 1) % songData.length === -1) {
                setSongState({
                    ...songState,
                    currentSong: [songData[songData.length - 1]],
                });
            } else {
                setSongState({
                    ...songState,
                    currentSong: [
                        songData[(currentIndex - 1) % songData.length],
                    ],
                });
            }
        }, 300);
    };

    const nextSongHandler = () => {
        setTimeout(() => {
            setSongState({
                ...songState,
                currentSong: [songData[(currentIndex + 1) % songData.length]],
            });
        }, 150);
    };

    const darkModeToggleHandler = () => {
        setUiState({ ...uiState, darkMode: !uiState.darkMode });
    };

    const libraryToggleHandler = (e: any) => {
        if (!window.visualViewport) return;
        if (window.visualViewport.width < 900) {
            setUiState({ ...uiState, libraryShown: true });
            console.log("changed");
        }
    };

    const songEndHandler = async () => {
        await setSongState({
            ...songState,
            currentSong: [songData[(currentIndex + 1) % songData.length]],
        });
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
            <RiSkipBackLine
                className="player__control-icon"
                onClick={previousSongHandler}
            />
            <PlayerPlayButton
                uiState={uiState}
                setUiState={setUiState}
                setSongState={setSongState}
                songState={songState}
            />
            <RiSkipForwardLine
                className="player__control-icon"
                onClick={nextSongHandler}
            />
            <DarkModeButton />
        </div>
    );
}

export default PlayerControl;
