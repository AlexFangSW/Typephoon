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

- HistoryStore
    - Append only list of movements
    - `push`
    - `currentState`

- HistoryData
    - wordIndex: int
    - charIndex: int
    - key: str
    - ts: iso ts
    - status: correct, wrong, n/a

- TextStore
    - 2D array that contains each charactor
    - `pushChar`
    - `popChar`
    - `pushWord`
    - `popWord`

- Validator
    - `validate`

- TextData
    - dom class
    - key 
    - extra: bool

- TextRenderer
    - responsible for updating the UI
    - `pushChar(TextData)`
    - `popChar(TextData)`
    - `pushWord(TextData[])`
    - `popWord(TextData[])`

- CursorRenderer
    - Moves the cursor to the correct position
    - current state
    - `move`


- The game ands once the wordIndex and charIndex is at the last postion
