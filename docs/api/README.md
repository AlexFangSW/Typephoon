# API documentation
## Auth
| Method | Route                   | Link                           |
|--------|-------------------------|--------------------------------|
| POST   | `/api/v1/auth/login`    | [link](./api/v1/auth/login.md) |
| POST   | `/api/v1/auth/logout`   | [link](./api/v1/auth/login.md) |
| POST   | `/api/v1/auth/register` | [link](./api/v1/auth/login.md) |

## Game
| Method    | Route                                  | Description                                        | Link                           |
|-----------|----------------------------------------|----------------------------------------------------|--------------------------------|
| GET       | `/api/v1/game/{ID}/gen-word`           | Generate words                                     | [link](./api/v1/auth/login.md) |
| GET       | `/api/v1/game/{ID}/lobby`              | Get Lobby info such as 'player list'               | [link](./api/v1/auth/login.md) |
| GET       | `/api/v1/game/{ID}/lobby/invite-token` | Get invite token for lobby                         | [link](./api/v1/auth/login.md) |
| GET       | `/api/v1/game/{ID}/lobby/countdown`    | Get lobby count down timer in seconds              | [link](./api/v1/auth/login.md) |
| GET       | `/api/v1/game/{ID}/in-game/countdown`  | Get in game count down timer in seconds            | [link](./api/v1/auth/login.md) |
| GET       | `/api/v1/game/{ID}/ranking`            | Get ranking for multi player game                  | [link](./api/v1/auth/login.md) |
| GET       | `/api/v1/game/{ID}/graph`              | Get playthrough progress graph (ex: WPM over time) | [link](./api/v1/auth/login.md) |
| POST      | `/api/v1/game/{ID}/movements`          | Save player movements                              | [link](./api/v1/auth/login.md) |
| GET       | `/api/v1/game/{ID}/movements`          | Get player movements (ex: For replay)              | [link](./api/v1/auth/login.md) |
| POST      | `/api/v1/game/{ID}/match/start`        | Send 'start' event for lobby                       | [link](./api/v1/auth/login.md) |
| POST      | `/api/v1/game`                         | Create game                                        | [link](./api/v1/auth/login.md) |
| WebSocket | `/api/v1/lobby`                        | Websocket connection for lobby                     | [link](./api/v1/auth/login.md) |
| WebSocket | `/api/v1/in-game`                      | Websocket connection for in game                   | [link](./api/v1/auth/login.md) |

## User
| Method | Route                                      | Description                              | Link                           |
|--------|--------------------------------------------|------------------------------------------|--------------------------------|
| GET    | `/api/v1/user/me/personal-page`            | Default data for rendering personal page | [link](./api/v1/auth/login.md) |
| GET    | `/api/v1/user/me/progress-over-time` | Graph data for progress over time        | [link](./api/v1/auth/login.md) |
| GET    | `/api/v1/user/me/history`                  | Get gameplay history                     | [link](./api/v1/auth/login.md) |
