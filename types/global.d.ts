import { Dispatch, SetStateAction } from "react";
import ThemeColors from "../src/Utils/Colors";

declare global {
  interface Window {
    electron: {
      ipcSend: (channel: string, data?: any) => void;
      ipcReceive: (channel: string, func: (data: any) => void) => void;
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
}

export {};
