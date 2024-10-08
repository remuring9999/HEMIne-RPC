function SongInfoTitle({ songState }: { songState: SongState }) {
  return <h1 className="song-info__title">{songState.currentSong[0].title}</h1>;
}

export default SongInfoTitle;
