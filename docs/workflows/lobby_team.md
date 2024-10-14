# Lobby (Team)
## Leader creates team
```mermaid
sequenceDiagram
    actor User
    User ->> Frontend: Click 'Create Team'
    Frontend ->> Backend: Create websocket connection 
    Frontend ->> Backend: Send init signal through WS
    Backend ->> DB: Create team
    Backend ->> Backend: Update in memory team table
    Backend ->> Frontend: WS trigger update
    Frontend ->> Frontend: Stores team info
    Frontend ->> Backend: Get team status
    Frontend ->> Frontend: Update UI
```

## Join team via invite link
```mermaid
sequenceDiagram
    actor User
    User ->> Frontend: Opens invite link in browser
    Frontend ->> Backend: Create websocket connection 
    Frontend ->> Backend: Send init signal through WS
    Backend ->> DB: Update team
    Backend ->> Backend: Update in memory team table
    Backend ->> Backend: *Broadcast team update
    Backend ->> Backend: Recived broadcast, check in memory team table
    Backend ->> Frontend: WS trigger update
    Frontend ->> Frontend: Stores team info
    Frontend ->> Backend: Get team status
    Frontend ->> Frontend: Update UI
```
### Explanation
- Broadcast team update: Sends broadcast to all servers, every server has a in memory team table

## Start logic
```mermaid
flowchart TD
    start([Start])
    leaderClickStart{Leader start game} 
    startGame[Start Game]
    finish([Finish])

    start-->leaderClickStart
    leaderClickStart-- Yes -->startGame
    leaderClickStart-- No -->leaderClickStart
    startGame-->finish
```
