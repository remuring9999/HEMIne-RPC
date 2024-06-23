import colors from "../../../Constants/Colors";
import shadow from "../../../Utils/Shadows";

function Artwork({
  uiState,
  songState,
}: {
  uiState: UiState;
  songState: SongState;
}) {
  const currentPalette = songState.currentSong[0]
    .palette as keyof typeof colors;

  return (
    <div
      className="artwork"
      style={{
        boxShadow: `${shadow(0, 0, 25, 0, colors[`${currentPalette}`])}`,
      }}
    >
      <img
        src={`${songState.currentSong[0].coverUrl}`}
        alt="Album Art"
        className={`artwork__img`}
        style={{
          animation: "spinning 7s infinite linear",
          animationPlayState: uiState.songPlaying ? "running" : "paused",
        }}
      />
    </div>
  );
}

export default Artwork;
