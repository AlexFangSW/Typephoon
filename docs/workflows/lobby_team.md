# Lobby (Team)
## On page load
```mermaid
flowchart TD
    start([Start])
    visitPage[Visit page] 
    foundTeamData{Found team data} 
    foundJoinToken{Found join token in url} 
    createTeam{Create team} 
    redirect[Redirect and clear token] 
    joinTeamSequence[*Join team sequence] 
    createTeamSequence[*Create team sequence] 
    reloadSequence[*Reload sequence] 
    renderPage[Render page]
    finish([Finish])

    start-->visitPage
    visitPage-->foundJoinToken
    foundJoinToken-- No -->foundTeamData
    foundJoinToken-- Yes -->joinTeamSequence
    joinTeamSequence-->renderPage
    joinTeamSequence-- Join failed -->redirect
    redirect-->renderPage
    foundTeamData-- No -->createTeam
    foundTeamData-- Yes -->reloadSequence
    reloadSequence-- Team data irrelevant -->createTeam
    reloadSequence-->renderPage
    createTeam-- No -->renderPage
    createTeam-- Yes -->createTeamSequence
    createTeamSequence-->renderPage
    renderPage-->finish
```
> For actions with "*", please refer to sequence diagrams below

## Create team sequence
```mermaid
sequenceDiagram
    Frontend ->> Backend: Create websocket connection 
    Frontend ->> Backend: Send init signal through WS
    Backend ->> Backend: Generate invite link
    Backend ->> DB: Create team
    Backend ->> Broker: Send delayed signal (max create team time)
    Backend ->> DB: Commit
    Backend ->> Backend: Update in memory team table
    Backend ->> Cache: Set team "create ts"
    Backend ->> Broker: Broadcast team update
    Backend ->> Frontend: WS trigger update
    Frontend ->> Frontend: Stores team info
    Frontend ->> Backend: Get team status
    Frontend ->> Frontend: Update UI
```

## (Leader) Reload sequence
```mermaid
sequenceDiagram
    Frontend ->> Backend: Create websocket connection 
    Frontend ->> Backend: Send init signal through WS
    Backend ->> DB: (lock) Select previous team
    Backend -->> Frontend: (unlock) Data irrelavent, END
    Backend ->> DB: Update leader status to 'connected'
    Backend ->> DB: (unlock) Commit
    Backend ->> Backend: Update in memory team table
    Backend ->> Broker: Broadcast team update
    Backend ->> Frontend: WS trigger update
    Frontend ->> Frontend: Stores team info
    Frontend ->> Backend: Get team status
    Frontend ->> Frontend: Update UI
```

## Join team sequence
```mermaid
sequenceDiagram
    Frontend ->> Backend: Create websocket connection 
    Frontend ->> Backend: Send init signal through WS
    Backend ->> DB: (lock) Select team
    Backend -->> Frontend: (unlock) Join failed, END
    Backend ->> DB: Update team
    Backend ->> DB: (unlock) Commit
    Backend ->> Backend: Update in memory team table
    Backend ->> Broker: Broadcast team update
    Backend ->> Frontend: WS trigger update
    Frontend ->> Frontend: Stores team info
    Frontend ->> Backend: Get team status
    Frontend ->> Frontend: Update UI
```

## Leader disconnect
```mermaid
sequenceDiagram
    Frontend ->> Backend: Disconnect/Close window
    Backend ->> DB: (lock) Set leader as disconnected
    Backend ->> DB: (unlock) Commit
    Backend ->> Backend: Remove from in memory team table
    Backend ->> Broker: Broadcast team update
```

## Member disconnect
```mermaid
sequenceDiagram
    Frontend ->> Backend: Disconnect/Close window
    Backend ->> DB: (lock) Remove from team
    Backend ->> DB: (unlock) Commit
    Backend ->> Backend: Remove from in memory team table
    Backend ->> Broker: Broadcast team update
```

## After page load
- Listen to websocket event
- Update count down timer for max create team time
    - The client fetches the current count down time from the server periodically (**Polling**)
    - The server gets the team's create timestamp and returns the current count down seconds
        - Create timestamp might be stored in a external cache
    - The client counts the delay, adjusts the timer then update locally

## Janitor
A delayed signal is sent to the broker on team creation.
When the "janitor" receives the signal, it will determine if the team should be deleted.
```mermaid
flowchart LR
    start([Start])
    gameStarted{"Game started"}
    delete["Delete team"]
    finish([Finish])
    
    start-- Recived signal -->gameStarted
    gameStarted-- Yes -->finish
    gameStarted-- No -->delete
    delete-->finish
```

## Start logic
- When the leader clicks 'Start'

## Start logic detail
When the leader clicks 'Start'
- The server sends a delayed signal to the broker
- The broker then broadcasts to all the servers
- Update team status in DB to 'started'
- Servers received the signal will then notify frontend to redirect users to the typing page where the game will take place.
- All cache related to "lobby" will be cleared
