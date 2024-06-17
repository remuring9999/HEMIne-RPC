import React from "react";
import SongInfoTitle from "../../Elements/Main/SongInfoTitle";
import SongInfoArtist from "../../Elements/Main/SongInfoArtist";
function SongInfo({ songState } : { songState: any }) {
    return (
        <div className="song-info">
            <SongInfoTitle songState={songState} />
            <SongInfoArtist songState={songState} />
        </div>
    );
}

export default SongInfo;
