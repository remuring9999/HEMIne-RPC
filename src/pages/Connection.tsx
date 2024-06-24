import { convertBadges } from "../Utils/ConvertBadges";
import css from "../Styles/css/connection.module.css";

function Connection() {
  const handleClose = () => {
    window.electron.ipcSend("CloseConnection");
  };

  const sotreData = localStorage.getItem("discordUser");
  const user = JSON.parse(sotreData as string);

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
              alt="badge"
              src={`/assets/DiscordBadges/${badge.data.origin}.svg`}
              title={badge.data.name}
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
              <h3>이메일</h3>
              <p>{user?.email}</p>
            </li>
            <li>
              <h3>MFA 활성화</h3>
              <p>{user?.mfa_enabled ? "활성화" : "비활성화"}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Connection;
