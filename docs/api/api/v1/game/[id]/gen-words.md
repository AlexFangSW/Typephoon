# GET: Generate words
Generate words for specified game.  
Same game should always have the same response.  
## Path
```
/api/v1/game/{ID}/gen-word
```

## Curl
```bash
curl https://{DOMAIN}/api/v1/game/123/gen-word
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
| Key     | Type   | Nullable | Description                          |
| ---     | ---    | ---      | ---                                  |
| status  | string |          | Custom response status               |
| message | string | v        | Words for this game                  |
| error   | array  | v        | Contains a list of error description |
| error[] | string |          | Error string explaining the error    |

## Successful Response
```json
status: 200
{
    "status": "OK",
    "message": "A lot of words for typing...xxx",
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
