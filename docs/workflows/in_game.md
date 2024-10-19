# In Game 
## Multi player
- Client WS connection, send init message
- Contdown starts (polling and self counter)
- Server sends 'start' signal to all players
- Send current status on each typing event while also receiving info of other players
- Server sends 'end' signal when player types the last word.
- Server saves playing data to DB
- Redirects user to finish page

### Player disconnect
- If possible, the client will send a signal telling the server it has closed the window.
- Server updates player status to 'disconnected' 

### Clean up 
- A delayed signal will be sent when the game starts, this signal is used to 
notify 'Janitor' service as well as servers.
    - When the janitor service receives this singal, it will assume the game has ended
    and adjust records in the database related to this game.
    - Servers that receives this signal will remove any in memory cache related with this team.

## Single player
- Game starts when player types, all in game mechanic is done on the client side
- Client sends gameplay info on finish
- Server saves playing data to DB
- Redirects user to finish page
