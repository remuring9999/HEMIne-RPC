import { Dispatch, SetStateAction } from "react";
import ThemeColors from "../src/Constants/Colors";

declare global {
  interface Window {
    electron: {
      ipcSend: (channel: string, data?: any) => void;
      ipcReceive: (channel: string, func: (data: any) => void) => void;
      ipcRemove: (channel: string) => void;
    };
  }

  interface SongState {
    currentSong: SongData[];
    isPlaying: Boolean;
    elapsed: number;
    duration: number;
  }

  interface UiState {
    libraryShown: Boolean;
    libraryPinned: Boolean;
    darkMode: Boolean;
    coverSpinning: Boolean;
    songPlaying: Boolean;
    seekWidth: Number;
  }

  type ReactSetAction<T> = Dispatch<SetStateAction<T>>;

  interface SongData {
    title: string;
    artist: string;
    coverUrl: string;
    thumbUrl: string;
    palette: keyof typeof ThemeColors;
    id: string;
  }

  type FlagNames =
    | "STAFF"
    | "HYPESQUAD"
    | "BUG_HUNTER_LEVEL_1"
    | "HYPESQUAD_ONLINE_HOUSE_1"
    | "HYPESQUAD_ONLINE_HOUSE_2"
    | "HYPESQUAD_ONLINE_HOUSE_3"
    | "PREMIUM_EARLY_SUPPORTER"
    | "VERIFIED_DEVELOPER"
    | "ACTIVE_DEVELOPER"
    | "BUG_HUNTER_LEVEL_2"
    | "VERIFIED_BOT"
    | "CERTIFIED_MODERATOR";

  interface FlagObject {
    [key: string]: {
      value: number;
      name: string;
      origin: string | FlagNames;
    };
  }
}

export {};
