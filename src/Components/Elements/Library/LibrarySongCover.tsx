import colors from "../../../Constants/Colors";
import shadow from "../../../Utils/Shadows";

function LibrarySongCover({ song }: { song: SongData }) {
  return (
    <figure className="library__song--cover">
      <img
        src={`${song.thumbUrl}`}
        alt="Artwork"
        className="library-song-cover-art"
        style={{
          boxShadow: `${shadow(
            0,
            0,
            15,
            0,
            colors[song.palette as keyof typeof colors]
          )}`,
        }}
      />
    </figure>
  );
}

export default LibrarySongCover;
