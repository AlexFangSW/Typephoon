# Lobby (multi)
## Start logic
State machine
```mermaid

```

```mermaid
flowchart LR
    start([Start])
    teamFull{Team full} 
    maxQueueTime{Reached max queue time} 
    userClickedJustStart{User clicked 'Just Start'} 
    allUsersAgree{All team members clicked 'Just Start'} 
    startTheGame[Start the game]
    finish([Finish])
    
    start-->userClickedJustStart
    userClickedJustStart-- Yes -->allUsersAgree
    userClickedJustStart-- No -->teamFull
    allUsersAgree-- Yes -->startTheGame
    allUsersAgree-- No -->teamFull
    teamFull-- No -->maxQueueTime
    teamFull-- Yes -->startTheGame
    maxQueueTime-- Yes -->startTheGame
    startTheGame-->finish
```

## Queue In
```mermaid
sequenceDiagram
    actor User
    User ->> Frontend: Clicks 'Queue In'
    Frontend ->> Backend: Create websocket connection 
    Frontend ->> Backend: Send init signal through WS
    Backend ->> DB: Select and lock available teams 
    Backend ->> Backend: Do queuing logic
    Backend ->> DB: *Update, commit and release lock
    Backend ->> Backend: *Broadcast team update
    Backend ->> Backend: Recived broadcast, check in memory team table
    Backend ->> Frontend: *WS trigger update
```
### Explanation
- Update, commit and release lock: Updates team data in DB as well as in memory team table
- Broadcast team update: Sends broadcast to all servers
- WS trigger update: Triggers frontend to fetch updated team data from an API, this includes all users in the same team.

## WS payload definition
TABLE
