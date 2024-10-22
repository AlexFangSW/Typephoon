# GET: Get lobby info (Team)
Get lobby info such as 'player list'

## Path
```
/api/v1/game/{ID}/lobby/info/team
```

## Curl
```bash
curl https://{DOMAIN}/api/v1/game/{ID}/lobby/info/team
```

## Path Params
| Name | Type   | Description | Example |
| ---  | ---    | ---         | ---     |
| ID   | string | Game ID     | abc123  |

## Query Params
None

## Authorization
None

## Headers
None

## Body
None

## Response
| Key                | Type    | Nullable | Description                                                                     |
| ---                | ---     | ---      | ---                                                                             |
| status             | string  |          | Custom response status                                                          |
| message            | list    | v        | A list of players                                                               |
| message[]          | object  |          | Player object                                                                   |
| message[].id       | string  |          | Player ID                                                                       |
| message[].name     | string  |          | Player name                                                                     |
| message[].isLeader | bool    |          | Player is team leader                                                           |
| message[].status   | string  |          | Player status such as `CONNECTED`, `DISCONNECTED`                               |
| message[].pb       | object  | v        | Containing player PB (Personal Best) record, could be null for annonymous users |
| message[].pb.wpm   | integer |          | Word per minute                                                                 |
| message[].pb.acc   | integer |          | Accuracy for the best WPM record                                                |
| error              | array   | v        | Contains a list of error description                                            |
| error[]            | string  |          | Error string explaining the error                                               |

## Successful Response
```json
status: 200
{
    "status": "OK",
    "message": [
        {
            "id": "JI321iJI",
            "name": "Alex Fang",
            "isLeader": true,
            "status": "CONNECTED",
            "pb": {
                "wpm": 60,
                "acc": 98
            }
        },
        {
            "id": "ann_JI321iJI",
            "name": "annonymous_123123",
            "isLeader": true,
            "status": "CONNECTED",
            "pb": null
        }
    ],
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
