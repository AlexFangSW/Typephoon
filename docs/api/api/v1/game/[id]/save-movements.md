# POST: Save player movements
Save player movements for playback

## Path
```
/api/v1/game/{ID}/movements
```

## Curl
```bash
curl -XPOST https://{DOMAIN}/api/v1/game/{ID}/movements \
    -d '
    [
        {
            "ts": "2024-10-26T11:24:47.123Z",
            "key": "a"
        },
        {
            "ts": "2024-10-26T11:24:47.200Z",
            "key": "b"
        }
    ]'
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
| Key    | Type   | Nullable | Description                          |
| ---    | ---    | ---      | ---                                  |
|        | array  |          | A list of movements                  |
| []     | object |          | Movement object                      |
| [].ts  | string |          | ISO timestamp (UTC) of the key press |
| [].key | string |          | The key pressed                      |


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
