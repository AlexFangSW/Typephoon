# Typephoon Frontend
## TODO
### Game play mechanics
- words are split by spaces, when the user hits space, the cursor will jump forward one word,
    if the user presses `ctrl+del` then cursor goes back one word.

- InputProcessor
    - Validates input and calls the following methods, the methods than calls the managers.
    - `pushChar`
    - `popChar`
    - `pushWord`
    - `popWord`

- HistoryManager
    - Append only list of movements
    - `push`

- HistoryData
    - wordIndex: int
    - charIndex: int
    - key: str
    - ts: iso ts
    - correct: bool

- TextManager
    - 2D array that contains each charactor which is also reponsible of updating the UI.
    - `pushChar`
    - `popChar`
    - `pushWord`
    - `popWord`
    - `validate`

- TextData
    - dom class
    - key 
    - extra: bool

- CursorManager
    - Moves the cursor to the correct position
    - current state
    - `move`

- The game ands once the wordIndex and charIndex is at the last postion
