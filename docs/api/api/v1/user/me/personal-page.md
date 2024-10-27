# GET: Get Initial data for personal page

## Path
```
/api/v1/user/me/personal-page
```

## Curl
```bash
curl https://{DOMAIN}/api/v1/user/me/personal-page
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
| Key                                    | Type    | Nullable | Description                           |
| ---                                    | ---     | ---      | ---                                   |
| status                                 | string  |          | Custom response status                |
| message                                | object  | v        |                                       |
| message.overview                       | object  |          |                                       |
| message.overview.best                  | object  |          | Best WPM/ACC                          |
| message.overview.best.wpm              | integer |          | Word per minute                       |
| message.overview.best.acc              | integer |          | Accuracy                              |
| message.overview.last10                | object  |          | Last 10 average WPM/ACC               |
| message.overview.last10.wpm            | integer |          | Word per minute                       |
| message.overview.last10.acc            | integer |          | Accuracy                              |
| message.overview.average               | object  |          | Average (all time) WPM/ACC            |
| message.overview.average.wpm           | integer |          | Word per minute                       |
| message.overview.average.acc           | integer |          | Accuracy                              |
| message.progressOverTime               | object  |          |                                       |
| message.progressOverTime.range         | string  |          | `DAY`, `WEEK`...etc                   |
| message.progressOverTime.records       | array   |          | A list of records                     |
| message.progressOverTime.records[]     | object  |          | Record object                         |
| message.progressOverTime.records[].ts  | string  |          | ISO timestamp (UTC)                   |
| message.progressOverTime.records[].wpm | integer |          | Word per minute                       |
| message.progressOverTime.records[].acc | integer |          | Accuracy                              |
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
        "overview": {
            "best": {
                "wpm": 60,
                "acc": 90,
            },
            "last10": {
                "wpm": 60,
                "acc": 90,
            },
            "average": {
                "wpm": 60,
                "acc": 90,
            }
        },
        "progressOverTime": {
            "range": "DAY",
            "records": [
                {
                    "ts": "2024-10-27T07:27:54.145Z",
                    "wpm": 30,
                    "acc": 80
                },
                {
                    "ts": "2024-10-27T08:27:54.145Z",
                    "wpm": 40,
                    "acc": 80
                },
                {
                    "ts": "2024-10-27T09:27:54.145Z",
                    "wpm": 60,
                    "acc": 90
                }
            ]
        },
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
status: 404
{
    "status": "NOT_FOUND",
    "message": null,
    "error": [
        "no history found for this user"
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
