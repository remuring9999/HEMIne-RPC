import React from "react";

function PlayerDuration({ value } : { value: string }) {
    return <p className="player__duration">{value}</p>;
}

export default PlayerDuration;
