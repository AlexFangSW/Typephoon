export enum GameBGMsgEvent {
  KEY_STOKE = "KEY_STOKE",
  START = "START"
}

export type IncommingGameBGMsg = {
  event: GameBGMsgEvent
  game_id: number
  user_id?: string
  word_index?: number
  char_index?: number
}

export type OutgoingGameBGMsg = {
  event: GameBGMsgEvent
  game_id?: number
  user_id?: string
  word_index?: number
  char_index?: number
}


export enum ErrorCode {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  KEY_NOT_FOUND = "KEY_NOT_FOUND",
  REFRESH_TOKEN_MISSMATCH = "REFRESH_TOKEN_MISSMATCH",
  INVALID_TOKEN = "INVALID_TOKEN",
  GAME_NOT_FOUND = "GAME_NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  WORDS_NOT_FOUND = "WORDS_NOT_FOUND",
  NOT_A_PARTICIPANT = "NOT_A_PARTICIPANT",
}

type SuccessResponse<T> = {
  ok: true
} & T

type ErrorContext = {
  code: ErrorCode
  message: string
}

type ErrorResponse = {
  ok: false
  error: ErrorContext
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse


export type CountdownResponse = ApiResponse<{
  seconds_left: number;
}>


export type GameUserInfo = {
  id: string;
  name: string;

  finished?: string;
  rank: number;
  wpm?: number;
  wpm_raw?: number;
  acc?: number;
};

export type GamePlayersResponse = ApiResponse<{
  me: GameUserInfo;
  others: Map<string, GameUserInfo>;
}>

export type GameWordsResponse = ApiResponse<{
  words: string
}>

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
