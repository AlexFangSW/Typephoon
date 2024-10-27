# GET: Get player movements
Get player movements for playback

## Path
```
/api/v1/game/{ID}/movements
```

## Curl
```bash
curl https://{DOMAIN}/api/v1/game/{ID}/movements
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
| Key                     | Type   | Nullable | Description                          |
| ---                     | ---    | ---      | ---                                  |
| status                  | string |          | Custom response status               |
| message                 | object | v        |                                      |
| message.movements       | array  |          | A list of movements                  |
| message.movements[]     | object |          | Movement object                      |
| message.movements[].ts  | string |          | ISO timestamp (UTC) of the key press |
| message.movements[].key | string |          | The key pressed                      |
| error                   | array  | v        | Contains a list of error description |
| error[]                 | string |          | Error string explaining the error    |

## Successful Response
```json
status: 200
{
    "status": "OK",
    "message": {
        "movements": [
            {
                "ts": "2024-10-27T07:27:54.145Z",
                "key": "a",
            },
            {
                "ts": "2024-10-27T07:27:54.245Z",
                "key": "b",
            }
        ]
    },
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
