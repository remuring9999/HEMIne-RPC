import React, { useEffect } from "react";
import colors from "../../../Constants/Colors";
import gradients from "../../../Constants/Gradients";
import shadow from "../../../Utils/Shadows";

function PlayerSeekBar({
  songState,
  setSongState,
}: {
  songState: SongState;
  setSongState: ReactSetAction<SongState>;
}) {
  const currentPalette = songState.currentSong[0].palette;

  const playerSeekHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSongState({
      ...songState,
      elapsed: parseInt(value),
    });
  };

  useEffect(() => {
    if (!songState.isPlaying) return;
    const interval = setInterval(() => {
      setSongState({
        ...songState,
        elapsed: songState.elapsed + 1,
      });
    }, 1100);

    return () => clearInterval(interval);
  });

  return (
    <div className="player__seek-bar--wrapper">
      <div
        className="player__seek-bar--gradient"
        style={{
          boxShadow: `${shadow(
            0,
            0,
            30,
            0,
            colors[`${currentPalette as keyof typeof colors}`]
          )}`,
          background: `${
            gradients[`${currentPalette as keyof typeof gradients}`]
          }`,
          width: `${(songState.elapsed / songState.duration) * 100}%`,
        }}
      ></div>
      <input
        min={0}
        max={songState.duration || 0}
        value={songState.elapsed || 0}
        onChange={playerSeekHandler}
        type="range"
        className="player__seek-bar"
        defaultValue={0}
      />
    </div>
  );
}

export default PlayerSeekBar;
