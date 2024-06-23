import { Flags } from "../Constants/Flags";

export const convertBadges = (userFlag: number): any => {
  let badges = [];

  for (const flag in Flags) {
    if ((userFlag & Flags[flag].value) === Flags[flag].value) {
      badges.push({
        name: Flags[flag].name,
        data: Flags[flag],
      });
    }
  }

  return badges;
};
