# WebSocket: WebSocket for in game
## Payload structure
General payload structure used for all websocket connection.  
The payload MUST be json serializable

| Key    | Type    | Description                                                                                                 |
| ---    | ---     | ---                                                                                                         |
| signal | integer | The signal type for this payload                                                                            |
| body   | Any     | Every signal has their own structure for the body, documented in "Payload Type" column in "Signals" section |
### Example
```json
{
    "signal": 2,
    "body": {
        "token": "xxx.xxx.xxx",
        "gameID": "xxxxxxxxxx"
    }
}
```

## Signals
| Name          | Type    | Value | Body Type    | From (Client/Server) | Description                                                        |
|---------------|---------|-------|--------------|----------------------|--------------------------------------------------------------------|
| PING          | integer | 0     | None         | Client,Server        | Used for connection test                                           |
| PONG          | integer | 1     | None         | Client,Server        | Used for connection test                                           |
| CLIENT_INIT   | integer | 2     | ClientInit   | Client               | Client init message                                                |
| SERVER_INIT   | integer | 3     | ServerInit   | Server               | Server init message, basically a response to "client init"         |
| DENIED        | integer | 4     | Denied       | Server               | Server denied the connection                                       |
| START         | integer | 5     | None         | Server               | Triggers game start event                                          |
| CLOSE         | integer | 6     | None         | Client               | If possible, the client will send this signal before disconnecting |
| CLIENT_STATUS | integer | 7     | ClientStatus | Client,Server        | Sent client status like player position                            |

## Types
### ClientInit
| Key    | Type   | Nullable | Description                         | Example     |
| ---    | ---    | ---      | ---                                 | ---         |
| token  | string |          | JWT token to verify this connection | xxx.xxx.xxx |
| gameID | string | v        | Game ID for reconnecting            | abc123      |

#### Example
```json
{
    "token": "xxx.xxx.xxx",
    "gameID": "abc123"
}
```

### ServerInit
| Key    | Type   | Nullable | Description | Example |
| ---    | ---    | ---      | ---         | ---     |
| gameID | string |          | Game ID     | abc123  |

#### Example
```json
{
    "gameID": "abc123"
}
```

### Denied
| Key    | Type   | Nullable | Description        | Example                   |
| ---    | ---    | ---      | ---                | ---                       |
| reason | string |          | Reason for denying | Token verification failed |

#### Example
```json
{
    "reason": "token verification failed"
}
```

### ClientStatus
| Key      | Type    | Nullable | Description                                        | Example |
| ---      | ---     | ---      | ---                                                | ---     |
| position | integer |          | To find which character the player is currently on | 20      |
| playerID | string  |          | Player ID                                          | xxxxxxx |
| key      | string  |          | Player keystroke                                   | A       |

#### Example
```json
{
    "position": 20,
    "playerID": "xxxxxxxx",
    "key": "A"
}
```
