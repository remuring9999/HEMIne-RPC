import LibraryHeaderTitle from "../Elements/Library/LibraryHeaderTitle";
import LibraryHeaderCloseIcon from "../Elements/Library/LibraryHeaderCloseIcon";

function MenuHeader({
  uiState,
  setUiState,
}: {
  uiState: UiState;
  setUiState: ReactSetAction<UiState>;
}) {
  return (
    <nav className="nav__header">
      <LibraryHeaderTitle />
      <LibraryHeaderCloseIcon uiState={uiState} setUiState={setUiState} />
    </nav>
  );
}

export default MenuHeader;
