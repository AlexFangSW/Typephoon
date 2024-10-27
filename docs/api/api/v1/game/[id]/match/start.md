# POST: Send 'start' event for lobby
This API functions differently in 'Team' and 'Random' mode.  
For 'Team' mode, this action is limit for the team leader.  
For 'Random' mode, this works a bit like a voting system, 
once all the players decided to start the game, the game will start.  


## Path
```
/api/v1/game/{ID}/match/start
```

## Curl
```bash
curl -XPOST https://{DOMAIN}/api/v1/game/{ID}/match/start
```

## Path Params
| Name | Type   | Description | Example |
| ---  | ---    | ---         | ---     |
| ID   | string | Game ID     | abc123  |

## Query Params
None

## Authorization
| Placement          | Name  | Description      | Example     |
| ---                | ---   | ---              | ---         |
| Cookie (HTTP Only) | TP_AT | JWT access token | xxx.xxx.xxx |


## Headers
None

## Body
None


## Response
| Key     | Type   | Nullable | Description                          |
| ---     | ---    | ---      | ---                                  |
| status  | string |          | Custom response status               |
| message | string | v        | Success message                        |
| error   | array  | v        | Contains a list of error description |
| error[] | string |          | Error string explaining the error    |

## Successful Response
```json
status: 200
{
    "status": "OK",
    "message": "success",
    "error": null
}
```
## Error Response
```json
status: 404
{
    "status": "NOT_FOUND",
    "message": null,
    "error": [
        "game not found, id: abc123"
    ]
}
```

```json
status: 401
{
    "status": "UNAUTHORIZED",
    "message": null,
    "error": [
        "authorization failed"
    ]
}
```
