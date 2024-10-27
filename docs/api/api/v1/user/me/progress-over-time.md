# GET: Get progress over time

## Path
```
/api/v1/user/me/progress-over-time
```

## Curl
```bash
curl https://{DOMAIN}/api/v1/user/me/progress-over-time?range=year
```

## Path Params
None

## Query Params
| Name  | Type   | Required | Description                                    | Example |
| ---   | ---    | ---      | ---                                            | ---     |
| range | string |          | `day`(default), `week`, `month`, `year`, `all` | `day`  |

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
| message.progressOverTime               | object  |          |                                       |
| message.progressOverTime.range         | string  |          | `DAY`, `WEEK`...etc                   |
| message.progressOverTime.records       | array   |          | A list of records                     |
| message.progressOverTime.records[]     | object  |          | Record object                         |
| message.progressOverTime.records[].ts  | string  |          | ISO timestamp (UTC)                   |
| message.progressOverTime.records[].wpm | integer |          | Word per minute                       |
| message.progressOverTime.records[].acc | integer |          | Accuracy                              |
| error                                  | array   | v        | Contains a list of error description  |
| error[]                                | string  |          | Error string explaining the error     |

## Successful Response
```json
status: 200
{
    "status": "OK",
    "message": {
        "progressOverTime": {
            "range": "YEAR",
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
        }
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
