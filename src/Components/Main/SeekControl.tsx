import PlayerDuration from "../Elements/Main/PlayerDuration";
import PlayerSeekBar from "../Elements/Main/PlayerSeekBar";

function SeekControl({
  songState,
  setSongState,
}: {
  songState: SongState;
  setSongState: ReactSetAction<SongState>;
}) {
  const getTime = (time: number) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };
  return (
    <div className="player__seek-controls">
      <PlayerDuration value={`${getTime(songState.elapsed)}`} />
      <PlayerSeekBar songState={songState} setSongState={setSongState} />
      <PlayerDuration
        value={`${
          getTime(songState.duration) === "NaN:aN"
            ? "0:00"
            : getTime(songState.duration)
        }`}
      />
    </div>
  );
}

export default SeekControl;
