import css from "../../Styles/process.module.css";

function TitleBar() {
  const handleClose = () => {
    window.electron.ipcSend("closeApp");
  };

  const handleMaximize = () => {
    window.electron.ipcSend("maximizeApp");
  };

  const handleMinimize = () => {
    window.electron.ipcSend("minimizeApp");
  };

  return (
    <div className={css.titlebar}>
      <button id="min" className={css.min} onClick={handleMinimize}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
        >
          <rect x="4" y="11" width="16" height="2" fill="#888a8a" />
        </svg>
      </button>
      <button id="max" className={css.max} onClick={handleMaximize}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
        >
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            fill="none"
            stroke="#888a8a"
            stroke-width="2"
          />
        </svg>
      </button>
      <button id="close" className={css.close} onClick={handleClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
        >
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
            stroke="#888a8a"
            stroke-width="2"
          />
          <line
            x1="6"
            y1="18"
            x2="18"
            y2="6"
            stroke="#888a8a"
            stroke-width="2"
          />
        </svg>
      </button>
    </div>
  );
}

export default TitleBar;
