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

export type SuccessResponse<T> = {
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

type OthersMap = {
  [key: string]: GameUserInfo
}

export type GamePlayersResponse = ApiResponse<{
  me: GameUserInfo;
  others: OthersMap;
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
  ts: number
  char: string
  currect: boolean
}

export type GameStatistics = {
  game_id: number
  wpm: number
  wpm_raw: number
  acc: number
}

export type GameResultResponse = ApiResponse<{ ranking: GameUserInfo[] }>

export type ProfileUserInfo = {
  id: string
  name: string
}

export type ProfileUserInfoResponse = ApiResponse<ProfileUserInfo>

export type ProfileStatistics = {
  total_games: number
  wpm_best: number
  acc_best: number
  wpm_avg_10: number
  acc_avg_10: number
  wpm_avg_all: number
  acc_avg_all: number
}

export type ProfileStatisticsResponse = ApiResponse<ProfileStatistics>

export enum GameType {
  SINGLE = 0,
  MULTI = 1,
  TEAM = 2,
}

export type GameResultWithGameType = {
  game_type: GameType
  game_id: number
  wpm: number
  wpm_raw: number
  accuracy: number
  finished_at: string
  rank: number
}

export type GameResultWithGameTypeResponse = ApiResponse<GameResultWithGameType[]>


export type ProfileHistory = {
  total: number
  has_prev_page: boolean
  has_next_page: boolean
  data: GameResultWithGameType[]
}

export type ProfileHistoryResponse = ApiResponse<ProfileHistory>

export type ProfileGraphItems = {
  data: GameResultWithGameType[]
}

export type ProfileGraphResponse = ApiResponse<ProfileGraphItems>
