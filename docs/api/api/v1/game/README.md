# POST: Create game
Limited to "Team" mode

## Path
```
/api/v1/game
```

## Curl
```bash
curl -XPOST https://{DOMAIN}/api/v1/game
```

## Path Params
None

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
| Key        | Type   | Nullable | Description                          |
| ---        | ---    | ---      | ---                                  |
| status     | string |          | Custom response status               |
| message    | object | v        |                                      |
| message.id | string |          | Game ID                              |
| error      | array  | v        | Contains a list of error description |
| error[]    | string |          | Error string explaining the error    |

## Successful Response
```json
status: 201
{
    "status": "CREATED",
    "message": {
        "id": "abc123"
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
