import { RiMenu4Fill } from "react-icons/ri";

function MenuIcon({
  uiState,
  setUiState,
}: {
  uiState: UiState;
  setUiState: ReactSetAction<UiState>;
}) {
  const navHandler = () => {
    setUiState({ ...uiState });
  };
  return <RiMenu4Fill className="menu__icon" onClick={navHandler} />;
}

export default MenuIcon;
