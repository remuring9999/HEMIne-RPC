import React from "react";
import colors from "../../Utils/Colors";

function SongInfoArtist({ songState }: { songState: any }) {
    return (
        <h1
            className="song-info__artist"
            style={{ color: `${colors[songState.currentSong[0].palette as keyof typeof colors]}` }}
        >
            {songState.currentSong[0].artist}
        </h1>
    );
}

export default SongInfoArtist;
