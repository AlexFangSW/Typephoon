# Lobby (Multi player)
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
    Backend ->> Frontend: WS trigger update
    Frontend ->> Frontend: Stores team info
    Frontend ->> Backend: Get team status
    Frontend ->> Frontend: Update UI
```
### Explanation
- Update, commit and release lock: Updates team data in DB as well as in memory team table
- Broadcast team update: Sends broadcast to all servers, every server has a in memory team table

### Reload page

## Start logic
```mermaid
flowchart TD
    start([Start])
    inQueue[In Queue]
    teamFull{Team full} 
    maxQueueTime{Reached max queue time} 
    userClickedJustStart{User clicked 'Just Start'} 
    allUsersAgree{All team members clicked 'Just Start'} 
    startTheGame[Start the game]
    finish([End])
    
    start-->inQueue
    inQueue-->userClickedJustStart
    userClickedJustStart-- Yes -->allUsersAgree
    userClickedJustStart-- No -->userClickedJustStart
    allUsersAgree-- Yes -->startTheGame
    allUsersAgree-- No -->allUsersAgree
    inQueue-->teamFull
    teamFull-- No -->teamFull
    teamFull-- Yes -->startTheGame
    inQueue-->maxQueueTime
    maxQueueTime-- Yes -->startTheGame
    maxQueueTime-- No -->maxQueueTime
    startTheGame-->finish
```
