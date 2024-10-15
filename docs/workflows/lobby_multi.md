# Lobby (Multi player)
## On page load
```mermaid
flowchart TD
    start([Start])
    visitPage[Visit page] 
    foundTeamData{Found team data} 
    queueIn{User queue in} 
    queueInSequence[*Queue in sequence] 
    reloadSequence[*Reload sequence] 
    renderPage[Render page]
    finish([Finish])

    start-->visitPage
    visitPage-->foundTeamData
    foundTeamData-- No -->queueIn
    foundTeamData-- Yes -->reloadSequence
    reloadSequence-- Team data irrelevant -->queueInSequence
    reloadSequence-->renderPage
    queueIn-- No -->renderPage
    queueIn-- Yes -->queueInSequence
    queueInSequence-->renderPage
    renderPage-->finish
```
> For actions with "*", please refer to sequence diagrams below

## Queue in sequence
```mermaid
sequenceDiagram
    Frontend ->> Backend: Create websocket connection 
    Frontend ->> Backend: Send init signal through WS
    Backend ->> DB: Select and lock available teams 
    Backend ->> Backend: Do queuing logic
    Backend ->> DB: *Update, commit and release lock
    Backend ->> Broker: *Broadcast team update
    Backend ->> Frontend: WS trigger update
    Frontend ->> Frontend: Stores team info
    Frontend ->> Backend: Get team status
    Frontend ->> Frontend: Update UI
```
### Explanation
- Update, commit and release lock: Updates team data in DB as well as in memory team table
- Broadcast team update: 
    - Sends broadcast to all servers
    - Upon receiving broadcast, servers will than send a update trigger through WS to notify all team members found in the in memory team table

## Reload sequence
```mermaid
sequenceDiagram
    Frontend ->> Backend: Create websocket connection 
    Frontend ->> Backend: *Send init signal through WS
    Backend ->> DB: (lock) Select available teams 
    Backend ->> Backend: Do queuing logic
    Backend -->> Frontend: Data irrelevent, END
    Backend ->> DB: (unlock) *Update, commit
    Backend ->> Broker: *Broadcast team update
    Backend ->> Frontend: WS trigger update
    Frontend ->> Backend: Get team status
    Frontend ->> Frontend: Update UI
```
### Explanation
- Send init signal through WS: This contains team data found on the client side, the client might be able to join the original team
- Update, commit and release lock: Updates team data in DB as well as in memory team table
- Broadcast team update: 
    - Sends broadcast to all servers
    - Upon receiving broadcast, servers will than send a update trigger through WS to notify all team members found in the in memory team table

## After page load
- Listen to websocket event
- Update count down timer for max queue time
    - The client fetches the current count down time from the server periodically (**Polling**)
    - The server gets the team's create timestamp and calculates the current count down seconds
        - This info will be included in the "in memory team table"

## On client disconnect
```mermaid
sequenceDiagram
    Frontend ->> Backend: Disconnect/Close window
    Backend ->> DB: (lock) Remove user from team
    Backend ->> Backend: remove from in memory team table 
    Backend ->> DB: (unlock) Commit
    Backend ->> Broker: Broadcast team update
```
## Ghost team
If all team members are disconnected, the team is deleted.
- This is performed by the server that removes the last team member

## Start logic
The game will start if one of the requirements are met
- Team full
- Reached max queue time
- All users clicked "Just start"

## Start logic detail
### Team full
When the **last** user is assigned to the team
- The server that made that action will send a delayed signal to the broker
- The broker then broadcasts to all the servers
- Servers received the signal will than notify frontend to redirect users to the typing page where the game will take place.
- All cache related to "lobby" will be cleared

### Reached max queue time
When the **first** user is assigned to the team
- The server that made that action will send a delayed signal to the broker (Wait for max queue time)
- The broker then broadcasts to all the servers
- Servers received the signal will than notify frontend to redirect users to the typing page where the game will take place.
- All cache related to "lobby" will be cleared

### All users clicked "Just start"
```mermaid
flowchart TD
    start([Start])
    userClick["User clicked 'Just start'"]
    addUserToCache["Add user to cache, remove extra"]
    isAllTeamMembersIncluded{"Is all team members in cache?"}
    sendSignal["Send start signal to broker for broadcast"]
    finish([Finish])

    start --> userClick 
    userClick --> addUserToCache
    addUserToCache --> isAllTeamMembersIncluded
    isAllTeamMembersIncluded -- Yes --> sendSignal
    isAllTeamMembersIncluded -- No --> finish
    sendSignal --> finish
```
