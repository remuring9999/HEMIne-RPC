import LibraryHeader from "../Library/LibraryHeader";
import LibraryListItem from "../Library/LibraryListItem";

function Library({
  uiState,
  setUiState,
  songState,
  songData,
}: {
  uiState: UiState;
  setUiState: ReactSetAction<UiState>;
  songState: SongState;
  songData: SongData[];
}) {
  return (
    <div className={`library ${uiState.libraryShown ? "" : "library--hidden"}`}>
      <LibraryHeader uiState={uiState} setUiState={setUiState} />
      <div className="library__wrapper">
        {songData.map((song: SongData) => (
          <LibraryListItem song={song} songState={songState} />
        ))}
      </div>
    </div>
  );
}

export default Library;
