import React from "react";

function LibrarySongArtist({ song } : { song: any }) {
    return <h4 className="library__song--artist">{song.artist}</h4>;
}

export default LibrarySongArtist;
