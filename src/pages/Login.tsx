import Starfield from "react-starfield";
import css from "../Styles/css/login.module.css";

function Login() {
  return (
    <div className={css.loginContainer}>
      <div className={css.loginNav}>
        <button
          id="close"
          style={{
            position: "fixed",
            right: "10px",
            top: "5px",
            backgroundColor: "transparent",
            border: "none",
          }}
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
      </div>
      <Starfield
        starCount={10000}
        starColor={[255, 255, 255]}
        speedFactor={0.1}
        backgroundColor="black"
      />
      <a className={css.neon}>Sign in with Discord</a>
    </div>
  );
}

export default Login;
