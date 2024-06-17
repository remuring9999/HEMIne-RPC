import React from "react";
import LibraryHeader from "../Components/Library/LibraryHeader";
import LibraryListItem from "../Components/Library/LibraryListItem";

function Library({
    uiState,
    setUiState,
    setSongState,
    songState,
    songData,
}: {
    uiState: any;
    setUiState: any;
    setSongState: any;
    songState: any;
    songData: any;

}) {
    return (
        <div
            className={`library ${uiState.libraryShown ? "" : "library--hidden"
                }`}
        >
            <LibraryHeader uiState={uiState} setUiState={setUiState} />
            <div className="library__wrapper">
                {songData.map((song: any) => (
                    <LibraryListItem
                        song={song}
                        songState={songState}
                        setSongState={setSongState}
                    />
                ))}
            </div>
        </div>
    );
}

export default Library;
