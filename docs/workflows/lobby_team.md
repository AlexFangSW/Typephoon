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
```

## (Leader) Reload sequence
```mermaid
```

## Join team sequence
```mermaid
```

## Leader disconnect
XXX
## Member disconnect
XXX

## Ghost team
XXX

## Start logic

## Start logic detail
