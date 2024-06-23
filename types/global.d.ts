import { Dispatch, SetStateAction } from "react";

declare global {
  interface Window {
    electron: {
      ipcSend: (channel: string, data?: any) => void;
    };
  }

  interface SongState {
    currentSong: SongData[];
    isPlaying: Boolean;
    elapsed: number;
    duration: number;
  }

  interface UiState {
    aboutShown: Boolean;
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
    palette: string;
    id: string;
  }
}

export {};
