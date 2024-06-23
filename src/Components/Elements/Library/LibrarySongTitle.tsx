function LibrarySongTitle({ song }: { song: SongData }) {
  return <h4 className="library__song--title">{song.title}</h4>;
}

export default LibrarySongTitle;
