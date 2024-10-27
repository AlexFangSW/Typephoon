# GET: Get Initial data for personal page

## Path
```
/api/v1/user/me/history
```

## Curl
```bash
curl https://{DOMAIN}/api/v1/user/me/history?page=2
```

## Path Params
None

## Query Params
| Name | Type    | Required | Description            | Example |
| ---  | ---     | ---      | ---                    | ---     |
| page | integer |          | Page number, default 1 | 12      |

## Authorization
| Placement          | Name  | Description      | Example     |
| ---                | ---   | ---              | ---         |
| Cookie (HTTP Only) | TP_AT | JWT access token | xxx.xxx.xxx |


## Headers
None

## Body
None


## Response
| Key                                    | Type    | Nullable | Description                           |
| ---                                    | ---     | ---      | ---                                   |
| status                                 | string  |          | Custom response status                |
| message                                | object  | v        |                                       |
| message.histories                      | array   |          | A list of histories                   |
| message.histories[]                    | object  |          | History object                        |
| message.histories[].wpm                | integer |          | Word per minute                       |
| message.histories[].acc                | integer |          | Accuracy                              |
| message.histories[].type               | string  |          | Game type `MULTI`, `RANDOM`, `SOLO`   |
| message.histories[].ts                 | string  |          | User finish time. ISO timestamp (UTC) |
| message.histories[].id                 | string  |          | Game ID                               |
| message.histories[].replay             | boolean |          | Is replay available                   |
| error                                  | array   | v        | Contains a list of error description  |
| error[]                                | string  |          | Error string explaining the error     |

## Successful Response
```json
status: 200
{
    "status": "OK",
    "message": {
        "histories": [
            {
                "wpm": 60,
                "acc": 90,
                "type": "TEAM",
                "ts": "2024-10-27T09:27:54.145Z",
                "id": "abc123",
                "replay": true
            },
            {
                "wpm": 60,
                "acc": 90,
                "type": "SINGLE",
                "ts": "2024-10-27T09:27:54.145Z",
                "id": "abc123",
                "replay": true
            },
            {
                "wpm": 60,
                "acc": 90,
                "type": "RANDOM",
                "ts": "2024-10-27T09:27:54.145Z",
                "id": "abc123",
                "replay": false
            }
        ]
    },
    "error": null
}
```
## Error Response
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
