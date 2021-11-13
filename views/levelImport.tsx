import React from 'react'

export function LevelImport (props: {createGameView : (importedLevelString: string) => void}): React.ReactElement {
  // TODO: Dodać obsługę błędu przy wklejeniu nieprawidłowego JSONa
  const [importedLevel, updateImportedLevel] = React.useState(`{
    "fieldsPerRow": 4,
    "baseDragon": {
      "fieldId": 5, 
      "direction": "R", 
      "canMove": true, 
      "gemsInPocket": {
        "BLACK": 0,
        "BLUE": 0,
        "YELLOW": 0,
        "RED": 0,
        "GREEN": 0
      }},
    "gadgets": [
        ["ARROWLEFT", 1],
        ["ARROWUP", 1],
        ["ARROWRIGHT", 1],
        ["ARROWDOWN", 1]
    ],
    "fields": [
        {"id": 0, "image": "W", "typeOfField": "WALL"},
        {"id": 1, "image": "W", "typeOfField": "WALL"},
        {"id": 2, "image": "W", "typeOfField": "WALL"},
        {"id": 3, "image": "W", "typeOfField": "WALL"},

        {"id": 4, "image": "W", "typeOfField": "WALL"},
        {"id": 5, "image": "E", "typeOfField": "START"},
        {"id": 6, "image": "E", "typeOfField": "EMPTY"},
        {"id": 7, "image": "W", "typeOfField": "WALL"},

        {"id": 8, "image": "W", "typeOfField": "WALL"},
        {"id": 9, "image": "E", "typeOfField": "EMPTY"},
        {"id": 10, "image": "E", "typeOfField": "EMPTY"},
        {"id": 11, "image": "W", "typeOfField": "WALL"},

        {"id": 12, "image": "W", "typeOfField": "WALL"},
        {"id": 13, "image": "W", "typeOfField": "WALL"},
        {"id": 14, "image": "W", "typeOfField": "WALL"},
        {"id": 15, "image": "W", "typeOfField": "WALL"}
    ],
    "treeGems": {
      "BLACK":0,
      "BLUE":0,
      "YELLOW":0,
      "RED":0,
      "GREEN":0
    }
  }`)

  function onSubmit (event : React.FormEvent<HTMLFormElement>) : void {
    event.preventDefault()
    props.createGameView(importedLevel)
  }

  return (
      <form onSubmit={onSubmit}>
        <label>Wpisz poziom</label>
        <textarea name='level' onChange={(event) => updateImportedLevel(JSON.stringify(JSON.parse(event.target.value), null, 4))} rows={50} cols={50} value={importedLevel}>
        </textarea>
        <input type="submit" value="Graj"/>
      </form>
  )
}
