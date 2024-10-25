# GET: Get ranking for multi player game
Returns a list of players and their ranking related info.
The list might not be complete if some of the accouts are deleted.

## Path
```
/api/v1/game/{ID}/ranking
```

## Curl
```bash
curl -XPOST https://{DOMAIN}/api/v1/game/{ID}/ranking
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
| Key               | Type    | Nullable | Description                                                          |
| ---               | ---     | ---      | ---                                                                  |
| status            | string  |          | Custom response status                                               |
| message           | array   | v        | Array of users                                                       |
| message[]         | object  |          | User info                                                            |
| message[].id      | string  |          | User id                                                              |
| message[].name    | string  |          | Username                                                             |
| message[].ranking | integer | v        | User ranking. Defaults to `null` if the user didn't finish           |
| message[].status  | string  |          | `DISCONNECTED`, `IN_GAME`, `FINISHED`...etc                          |
| message[].wpm     | integer | v        | WPM for this game. Defaults to `null` if the user didn't finish      |
| message[].acc     | integer | v        | Accuracy for this game. Defaults to `null` if the user didn't finish |
| error             | array   | v        | Contains a list of error description                                 |
| error[]           | string  |          | Error string explaining the error                                    |

## Successful Response
```json
status: 200
{
    "status": "OK",
    "message": [
        {
            "id": "aaabbbccc",
            "name": "Alex Fang",
            "ranking": 2,
            "status": "FINISHED",
            "wpm": 60,
            "acc": 90
        },
        {
            "id": "22222",
            "name": "annonymous_123",
            "ranking": 1,
            "status": "FINISHED",
            "wpm": 55,
            "acc": 90
        },
        {
            "id": "333333",
            "name": "annonymous_222",
            "ranking": null,
            "status": "DISCONNECTED",
            "wpm": null,
            "acc": null
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
