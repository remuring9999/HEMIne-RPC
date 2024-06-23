import colors from "../../../Constants/Colors";

function SongInfoArtist({ songState }: { songState: SongState }) {
  return (
    <h1
      className="song-info__artist"
      style={{
        color: `${
          colors[songState.currentSong[0].palette as keyof typeof colors]
        }`,
      }}
    >
      {songState.currentSong[0].artist}
    </h1>
  );
}

export default SongInfoArtist;
