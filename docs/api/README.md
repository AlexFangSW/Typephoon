# API documentation
## Auth
| Method | Path                    | Link                           |
|--------|-------------------------|--------------------------------|
| POST   | `/api/v1/auth/login`    | [link](./api/v1/auth/login.md) |
| POST   | `/api/v1/auth/logout`   | [link]()                       |
| POST   | `/api/v1/auth/register` | [link]()                       |

## Game
| Method    | Path                                   | Description                                           | Link                                             |
|-----------|----------------------------------------|-------------------------------------------------------|--------------------------------------------------|
| GET       | `/api/v1/game/{ID}/words`              | Get words for game                                    | [link](./api/v1/game/[id]/words.md)              |
| GET       | `/api/v1/game/{ID}/lobby/info/team`    | Get lobby info for 'team'                             | [link](./api/v1/game/[id]/lobby/info/team.md)    |
| GET       | `/api/v1/game/{ID}/lobby/info/random`  | Get lobby info 'random'                               | [link](./api/v1/game/[id]/lobby/info/random.md)  |
| GET       | `/api/v1/game/{ID}/lobby/invite-token` | Get invite token for lobby                            | [link](./api/v1/game/[id]/lobby/invite-token.md) |
| POST      | `/api/v1/game/{ID}/lobby/kick`         | Kick somone out of the lobby (Limited to "Team" mode) | [link](./api/v1/game/[id]/lobby/kick.md)         |
| POST      | `/api/v1/game/{ID}/lobby/disband`      | Close the lobby (Limited to "Team" mode)              | [link](./api/v1/game/[id]/lobby/disband.md)      |
| GET       | `/api/v1/game/{ID}/lobby/countdown`    | Get lobby count down timer in seconds                 | [link](./api/v1/game/[id]/lobby/countdown.md)    |
| GET       | `/api/v1/game/{ID}/in-game/countdown`  | Get in game count down timer in seconds               | [link](./api/v1/game/[id]/in-game/countdown.md)  |
| GET       | `/api/v1/game/{ID}/ranking`            | Get ranking for multi player game                     | [link](./api/v1/auth/login.md)                   |
| POST      | `/api/v1/game/{ID}/movements`          | Save player movements                                 | [link](./api/v1/auth/login.md)                   |
| GET       | `/api/v1/game/{ID}/movements`          | Get player movements (ex: For replay)                 | [link](./api/v1/auth/login.md)                   |
| POST      | `/api/v1/game/{ID}/match/start`        | Send 'start' event for lobby                          | [link](./api/v1/auth/login.md)                   |
| POST      | `/api/v1/game`                         | Create game                                           | [link](./api/v1/auth/login.md)                   |
| WebSocket | `/api/v1/lobby`                        | Websocket connection for lobby                        | [link](./api/v1/auth/login.md)                   |
| WebSocket | `/api/v1/in-game`                      | Websocket connection for in game                      | [link](./api/v1/auth/login.md)                   |

## User
| Method | Path                                 | Description                              | Link                           |
|--------|--------------------------------------|------------------------------------------|--------------------------------|
| GET    | `/api/v1/user/me/personal-page`      | Default data for rendering personal page | [link](./api/v1/auth/login.md) |
| GET    | `/api/v1/user/me/progress-over-time` | Graph data for progress over time        | [link](./api/v1/auth/login.md) |
| GET    | `/api/v1/user/me/history`            | Get gameplay history                     | [link](./api/v1/auth/login.md) |
