import React from 'react'

export function LevelImport (props: {createGameView : (importedLevelString: string) => void}): React.ReactElement {
  // TODO: Dodać obsługę błędu przy wklejeniu nieprawidłowego JSONa
  const [importedLevel, updateImportedLevel] = React.useState(`{
    "fields":[
      {"typeOfField":"WALL","image":"W","id":0},
      {"typeOfField":"WALL","image":"W","id":1},
      {"typeOfField":"WALL","image":"W","id":2},
      {"typeOfField":"WALL","image":"W","id":3},
      {"typeOfField":"WALL","image":"W","id":4},
      {"typeOfField":"WALL","image":"W","id":5},
      {"typeOfField":"START","image":"E","id":6},
      {"typeOfField":"EMPTY","image":"E","id":7},
      {"typeOfField":"EMPTY","image":"E","id":8},
      {"typeOfField":"WALL","image":"W","id":9},
      {"typeOfField":"WALL","image":"W","id":10},
      {"typeOfField":"EMPTY","image":"E","id":11},
      {"typeOfField":"EMPTY","image":"E","id":12},
      {"typeOfField":"EMPTY","image":"E","id":13},
      {"typeOfField":"WALL","image":"W","id":14},
      {"typeOfField":"WALL","image":"W","id":15},
      {"typeOfField":"ARROWRIGHT","image":"AR","id":16,"attributes":{"direction":"R"}},
      {"typeOfField":"SCALE","image":"S GREEN","id":17,"attributes":{"gemColor":"GREEN"}},
      {"typeOfField":"FINISH","image":"F","id":18,"attributes":{"opened":false}},
      {"typeOfField":"WALL","image":"W","id":19},
      {"typeOfField":"WALL","image":"W","id":20},
      {"typeOfField":"WALL","image":"W","id":21},
      {"typeOfField":"WALL","image":"W","id":22},
      {"typeOfField":"WALL","image":"W","id":23},
      {"typeOfField":"WALL","image":"W","id":24}
    ],
    "fieldsPerRow":5,
    "gadgets":[
      ["ARROWLEFT",5],
      ["ARROWRIGHT",5],
      ["ARROWUP",5],
      ["ARROWDOWN",5],
      ["SCALE",5]
    ],
    "baseDragon":{
      "fieldId":6,
      "direction":"D",
      "gemsInPocket":{
        "BLACK":1,
        "BLUE":1,
        "YELLOW":1,
        "RED":1,
        "GREEN":3},
        "canMove":true
      },
      "treeGems":{
        "BLACK":0,
        "BLUE":0,
        "YELLOW":0,
        "RED":0,
        "GREEN":3
      },
      "finishId":18}`)

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
