import Starfield from "react-starfield";
import css from "../Styles/css/login.module.css";

function Login() {
  return (
    <div className={css.loginContainer}>
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
