import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import css from "../../../Styles/css/discord.module.css";

function Discord() {
  const [isHovered, setIsHovered] = useState(false);
  const rpcConnected = true;
  const message = rpcConnected
    ? "Discord에 연결되었다네"
    : "Discord에 연결중이라네..";

  return (
    <div
      className={css.contain}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.electron.ipcSend("openConnection")}
    >
      <FaDiscord className={css.icon} />
      {isHovered && <div className={css.overText}>{message}</div>}
    </div>
  );
}

export default Discord;
