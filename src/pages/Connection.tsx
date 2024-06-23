import { useState } from "react";
import { APIUser } from "discord-api-types/v10";
import { convertBadges } from "src/Utils/ConvertBadges";
import css from "../Styles/css/connection.module.css";

function Connection() {
  const [userData, setUserData] = useState<APIUser>();

  window.electron.ipcReceive("userData", (data: APIUser) => {
    console.log(data);
    setUserData(data);
  });

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleClose = () => {
    window.electron.ipcSend("CloseConnection");
  };

  return (
    <div className={css.app} onClick={handleClose}>
      <div className={css.contain}>
        <div
          className={css.banner}
          style={{
            backgroundImage: `url('https://cdn.discordapp.com/banners/${
              userData?.id
            }/${userData?.banner}.${
              userData?.banner?.startsWith("a_") ? "gif" : "png"
            }?size=4096')`,
          }}
        ></div>
        <div className={css.profile}>
          <img
            src={`https://cdn.discordapp.com/avatars/${userData?.id}/${
              userData?.avatar
            }.${userData?.avatar?.startsWith("a_") ? "gif" : "png"}?size=4096`}
            alt="profile"
          />
          <div className={css.status}>
            <div className={css.statusOnline}></div>
          </div>
        </div>
        <div className={css.nickname}>{userData?.global_name}</div>
        <div className={css.badgesContain}>
          {convertBadges(userData?.flags as number).map((badge: FlagObject) => (
            <img src={`/assets/DiscordBadges/${badge.data.origin}.svg`}></img>
          ))}
        </div>
        <div className={css.userInfoContain}>
          <ul>
            <li>
              <h3>유저 아이디</h3>
              <p>{userData?.id}</p>
            </li>
            <li>
              <h3>유저 이름</h3>
              <p>{userData?.username}</p>
            </li>
            <li>
              <h3>이메일</h3>
              <p>{userData?.email}</p>
            </li>
            <li>
              <h3>MFA 활성화</h3>
              <p>{userData?.mfa_enabled ? "활성화" : "비활성화"}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Connection;
