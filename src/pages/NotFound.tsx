import Starfield from "react-starfield";
import css from "../Styles/css/error.module.css";

function NotFound() {
  const handleClose = () => {
    window.electron.ipcSend("APP_CLOSE");
  };

  return (
    <div>
      <button
        id="close"
        style={{
          position: "fixed",
          right: "10px",
          top: "5px",
          backgroundColor: "transparent",
          border: "none",
        }}
        onClick={handleClose}
      >
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
      <div className={css.container}>
        <div className={css.text}>여기가 어디 .. 404</div>
      </div>
      <Starfield
        starCount={10000}
        starColor={[255, 255, 255]}
        speedFactor={0.1}
        backgroundColor="black"
      />
    </div>
  );
}

export default NotFound;
