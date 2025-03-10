export enum GameBGMsgEvent {
  KEY_STOKE = "KEY_STOKE",
  START = "START"
}

export type GameBGMsg = {
  event: GameBGMsgEvent
  game_id: number
  user_id?: string
  word_index?: number
  char_index?: number
}

export type CountdownResponse = {
  seconds_left: number;
};

export type GameUserInfo = {
  id: string;
  name: string;

  finished?: string;
  rank: number;
  wpm?: number;
  wpm_raw?: number;
  acc?: number;
};

export type GamePlayersResponse = {
  me: GameUserInfo;
  others: Map<string, GameUserInfo>;
};

export type GameWordsResponse = {
  words: string
}

export type Position = {
  wordIndex: number
  charIndex: number
}

export type GameInfo = GameUserInfo & Position

export type Keystroke = {
  ts: Date
  char: string
  currect: boolean
}
