import { useState } from "react";
import { convertBadges } from "../Utils/ConvertBadges";
import css from "../Styles/css/connection.module.css";

function Connection() {
  const handleClose = () => {
    window.electron.ipcSend("CloseConnection");
  };

  const [isRPCConnected, setIsRPCConnected] = useState<boolean>(false);
  const sotreData = localStorage.getItem("discordUser");
  const user = JSON.parse(sotreData as string);

  window.electron.ipcReceive("isRPCConnected", (data) => {
    setIsRPCConnected(data);
  });

  return (
    <div className={css.app} onClick={handleClose}>
      <div className={css.contain}>
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
