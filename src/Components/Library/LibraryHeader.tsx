import React from "react";
import LibraryHeaderTitle from "../../Elements/Library/LibraryHeaderTitle";
import LibraryHeaderCloseIcon from "../../Elements/Library/LibraryHeaderCloseIcon";
function MenuHeader({ uiState, setUiState }: { uiState: any; setUiState: any }) {
    return (
        <nav className="nav__header">
            <LibraryHeaderTitle />
            <LibraryHeaderCloseIcon uiState={uiState} setUiState={setUiState} />
        </nav>
    );
}

export default MenuHeader;
