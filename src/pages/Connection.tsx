import css from "../Styles/css/connection.module.css";

import NitroIcon from "../assets/DiscordBadges/discordnitro.svg";
import Staff from "../assets/DiscordBadges/discordstaff.svg";
import ActiveDeveloper from "../assets/DiscordBadges/activedeveloper.svg";
import EarlySupporter from "../assets/DiscordBadges/discordearlysupporter.svg";
import DiscordPartner from "../assets/DiscordBadges/discordpartner.svg";
import DiscordMod from "../assets/DiscordBadges/discordmod.svg";
import discordboost9 from "../assets/NitroBoostTiers/discordboost9.svg";
import premiumbot from "../assets/DiscordBadges/premiumbot.png";

function Connection() {
  return (
    <div className={css.contain}>
      <div className={css.banner}></div>
      <div className={css.profile}>
        <img
          src="https://cdn.discordapp.com/avatars/868016688090710067/b7ecef916c41fede98007e241dcfb4a2.png?size=4096"
          alt="profile"
        />
        <div className={css.status}>
          <div className={css.statusOnline}></div>
        </div>
      </div>
      <div className={css.nickname}>! レムリン</div>
      <div className={css.badgesContain}>
        <img src={NitroIcon} alt="Nitro" />
        <img src={Staff} alt="Staff" />
        <img src={ActiveDeveloper} alt="Active Developer" />
        <img src={EarlySupporter} alt="Early Supporter" />
        <img src={DiscordPartner} alt="Discord Partner" />
        <img src={DiscordMod} alt="Discord Mod" />
        <img src={premiumbot} alt="Premium Bot" />
        <img src={discordboost9} alt="Discord Boost 9" />
      </div>
      <div className={css.userInfoContain}>
        <ul>
          <li>
            <h3>유저 ID</h3>
            <p>868016688090710067</p>
          </li>
          <li>
            <h3>유저 태그</h3>
            <p>! レムリン#0001</p>
          </li>
          <li>
            <h3>계정 생성일</h3>
            <p>2021년 10월 10일</p>
          </li>
          <li>
            <h3>서버 참여일</h3>
            <p>2021년 10월 10일</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Connection;
