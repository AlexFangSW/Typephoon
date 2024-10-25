# POST: Leave the lobby 
If a team leader uses this, the team is deleted.

## Path
```
/api/v1/game/{ID}/lobby/leave
```

## Curl
```bash
curl -XPOST https://{DOMAIN}/api/v1/game/{ID}/lobby/leave
```

## Path Params
| Name | Type   | Description | Example |
| ---  | ---    | ---         | ---     |
| ID   | string | Game ID     | abc123  |

## Query Params
None

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
    "message": "good bye",
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
        "who are you !? even annonymous users will have a temporary token"
    ]
}
```
