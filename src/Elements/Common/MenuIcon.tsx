import React from "react";
import { RiMenu4Fill } from "react-icons/ri";

function MenuIcon({ uiState, setUiState }: { uiState: any; setUiState: any }) {
    const navHandler = () => {
        setUiState({ ...uiState, aboutShown: true });
    };
    return <RiMenu4Fill className="menu__icon" onClick={navHandler} />;
}

export default MenuIcon;
