import { useState } from "react";
import { convertBadges } from "../Utils/ConvertBadges";
import css from "../Styles/css/connection.module.css";

function Connection() {
  const handleClose = () => {
    window.electron.ipcSend("PAGE_CONNECTION_CLOSE");
  };

  const [isRPCConnected, setIsRPCConnected] = useState<boolean>(false);
  const sotreData = localStorage.getItem("discordUser");
  const user = JSON.parse(sotreData as string);

  window.electron.ipcReceive("RPC_IS_CONNECTED", (data) => {
    setIsRPCConnected(data);
  });

  const DisconnectRPC = () => {
    window.electron.ipcSend("RPC_DISCONNECT");
  };

  const ConnectRPC = () => {
    window.electron.ipcSend("RPC_CONNECT", user);
  };

  const handleLogout = () => {
    window.electron.ipcSend("APP_LOGOUT");
  };

  return (
    <div className={css.app}>
      <div className={css.contain}>
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
              stroke="#36393F"
              stroke-width="2"
            />
            <line
              x1="6"
              y1="18"
              x2="18"
              y2="6"
              stroke="#36393F"
              stroke-width="2"
            />
          </svg>
        </button>
        <div
          className={css.banner}
          style={{
            backgroundImage: `url('https://cdn.discordapp.com/banners/${
              user?.id
            }/${user?.banner}.${
              user?.banner?.startsWith("a_") ? "gif" : "png"
            }?size=4096')`,
          }}
        ></div>
        <div className={css.profile}>
          <img
            src={`https://cdn.discordapp.com/avatars/${user?.id}/${
              user?.avatar
            }.${user?.avatar?.startsWith("a_") ? "gif" : "png"}?size=4096`}
            alt="profile"
          />
          <div className={css.status}>
            <div className={css.statusOnline}></div>
          </div>
        </div>
        <div className={css.nickname}>{user?.global_name}</div>
        <div className={css.badgesContain}>
          {convertBadges(user?.flags as number).map((badge: FlagObject) => (
            <img
              alt={badge.data.name}
              id="badge"
              src={`/assets/DiscordBadges/${badge.data.origin}.svg`}
            ></img>
          ))}
        </div>
        <button className={css.DangerButton} onClick={handleLogout}>
          로그아웃
        </button>
        <div className={css.userInfoContain}>
          <ul>
            <li>
              <h3>유저 아이디</h3>
              <p>{user?.id}</p>
            </li>
            <li>
              <h3>유저 이름</h3>
              <p>{user?.username}</p>
            </li>
            <li>
              <h3>Discord Client 연결여부</h3>
              <p>{isRPCConnected ? "HEMIne RPC로 연결됨" : "연결 대기중"}</p>
              {isRPCConnected ? (
                <button
                  className={css.DangerButton}
                  style={{ top: "135px" }}
                  onClick={DisconnectRPC}
                >
                  RPC 연결 해제
                </button>
              ) : (
                <button
                  className={css.PrimaryButton}
                  style={{ top: "135px" }}
                  onClick={ConnectRPC}
                >
                  RPC 연결
                </button>
              )}
            </li>
            <li>
              <h3>HEMIne</h3>
              <p>비활성화</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Connection;
