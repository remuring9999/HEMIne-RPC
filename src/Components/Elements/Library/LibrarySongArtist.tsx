function LibrarySongArtist({ song }: { song: SongData }) {
  return <h4 className="library__song--artist">{song.artist}</h4>;
}

export default LibrarySongArtist;
