# POST: Kick somone out of the lobby (Limited to "Team" mode)
Only team leaders can use this API

## Path
```
/api/v1/game/{ID}/lobby/kick
```

## Curl
```bash
curl -XPOST https://{DOMAIN}/api/v1/game/{ID}/lobby/kick?target_user=abc123
```

## Path Params
| Name | Type   | Description | Example |
| ---  | ---    | ---         | ---     |
| ID   | string | Game ID     | abc123  |

## Query Params
| Name        | Type   | Required | Description                                       | Example |
| ---         | ---    | ---      | ---                                               | ---     |
| target_user | string | v        | User ID. The target user to remove from the lobby | abc123  |

## Authorization
| Name          | Type   | Description | Example            |
| ---           | ---    | ---         | ---                |
| Authorization | string | JWT token   | Bearer xxx.xxx.xxx |


## Headers
None

## Body
None

## Response
| Key     | Type   | Nullable | Description                          |
| ---     | ---    | ---      | ---                                  |
| status  | string |          | Custom response status               |
| message | string | v        | Success message                      |
| error   | array  | v        | Contains a list of error description |
| error[] | string |          | Error string explaining the error    |

## Successful Response
```json
status: 200
{
    "status": "OK",
    "message": "out of sight, out of mind",
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
        "only team leaders can use this API"
    ]
}
```
