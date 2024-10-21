# [GET] `/api/v1/game/{ID}/gen-word`
Generate words for specified game.  
Same game should always have the same response.  
```bash
curl https://{DOMAIN}/api/v1/game/123/gen-word
```
## Response
| Name | Type | Example | Description |
| ---  |

## Example responses
### Success
```json
status: 200
{}
```
### Game not found
```json
status: 404
{}
```
