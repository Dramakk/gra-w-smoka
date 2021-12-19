import React, { useState } from 'react'
import Modal, { ButtonDescription } from '../helpers/Modal'

export default function LevelImport (props: {createGameView : (importedLevelString: string) => void}): React.ReactElement {
  // TODO: Dodać obsługę błędu przy wklejeniu nieprawidłowego JSONa
  const [showModal, updateShowModal] = useState(false)
  const [importedLevel, updateImportedLevel] = useState(`{
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
      "entrances": {},
      "exits": {},
      "treeRegisters": {"0":{"stored":0,"needed":0},"1":{"stored":0,"needed":0},"2":{"stored":0,"needed":0},"3":{"stored":0,"needed":0},"4":{"stored":0,"needed":0},"5":{"stored":0,"needed":0},"6":{"stored":0,"needed":0},"7":{"stored":0,"needed":0},"8":{"stored":0,"needed":0},"9":{"stored":0,"needed":0},"10":{"stored":0,"needed":0},"11":{"stored":0,"needed":0},"12":{"stored":0,"needed":0},"13":{"stored":0,"needed":0},"14":{"stored":0,"needed":0},"15":{"stored":0,"needed":0},"16":{"stored":0,"needed":0},"17":{"stored":0,"needed":0},"18":{"stored":0,"needed":0},"19":{"stored":0,"needed":0}},
      "finishId":18}`)
  const modalButtons: ButtonDescription[] = [
    {
      buttonText: 'Zamknij',
      buttonType: 'primary',
      onClick: () => onModalClose(false)
    }
  ]

  function onSubmit () : void {
    try {
      props.createGameView(importedLevel)
    } catch (e) {
      updateShowModal(true)
    }
  }

  function onBlur (event: React.FocusEvent<HTMLTextAreaElement>): void {
    try {
      const parsedJSON = JSON.parse(event.target.value)
      updateImportedLevel(JSON.stringify(parsedJSON, null, 4))
    } catch (e) {
      updateImportedLevel(event.target.value)
      updateShowModal(true)
    }
  }

  function onModalClose (event: boolean): void {
    updateShowModal(event)
  }

  return (
    <div className="import-level-container">
      <label htmlFor="level-input">Wpisz poziom</label>
      <textarea name='level-input' onChange={(event) => updateImportedLevel(event.target.value)} onBlur={onBlur} value={importedLevel}>
      </textarea>
      <button onClick={onSubmit}>Graj</button>
      <Modal show={showModal} buttons={modalButtons}>
        <div>Definicja poziomu zawiera błędy. Popraw je i spróbuj ponownie.</div>
      </Modal>
    </div>
  )
}
