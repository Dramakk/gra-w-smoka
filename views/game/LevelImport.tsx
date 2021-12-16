import React, { useState } from 'react'
import Modal, { ButtonDescription } from '../helpers/Modal'

export default function LevelImport (props: {createGameView : (importedLevelString: string) => void}): React.ReactElement {
  // TODO: Dodać obsługę błędu przy wklejeniu nieprawidłowego JSONa
  const [showModal, updateShowModal] = useState(false)
  const [importedLevel, updateImportedLevel] = useState(`{
    "fields": [
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 0
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 1
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 2
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 3
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 4
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 5
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 6
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 7
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 8
        },
        {
            "typeOfField": "START",
            "image": "E",
            "id": 9
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 10
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 11
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 12
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 13
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 14
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 15
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 16
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 17
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 18
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 19
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 20
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 21
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 22
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 23
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 24
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 25
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 26
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 27
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 28
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 29
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 30
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 31
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 32
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 33
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 34
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 35
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 36
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 37
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 38
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 39
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 40
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 41
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 42
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 43
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 44
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 45
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 46
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 47
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 48
        },
        {
            "typeOfField": "ARROWRIGHT",
            "image": "AR",
            "id": 49,
            "attributes": {
                "direction": "R"
            }
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 50
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 51
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 52
        },
        {
            "typeOfField": "EMPTY",
            "image": "E",
            "id": 53
        },
        {
            "typeOfField": "FINISH",
            "image": "F",
            "id": 54,
            "attributes": {
                "opened": true
            }
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 55
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 56
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 57
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 58
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 59
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 60
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 61
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 62
        },
        {
            "typeOfField": "WALL",
            "image": "W",
            "id": 63
        }
    ],
    "fieldsPerRow": 8,
    "gadgets": [],
    "baseDragon": {
        "fieldId": 9,
        "direction": "D",
        "gemsInPocket": {
            "BLACK": 0,
            "BLUE": 0,
            "YELLOW": 0,
            "RED": 0,
            "GREEN": 0
        },
        "canMove": true,
        "directionHistory": {
            "previous": null,
            "current": "D"
        }
    },
    "treeGems": {
        "BLACK": 0,
        "BLUE": 0,
        "YELLOW": 0,
        "RED": 0,
        "GREEN": 0
    },
    "treeRegisters": {
        "0": {
            "stored": 0,
            "needed": 0
        },
        "1": {
            "stored": 0,
            "needed": 0
        },
        "2": {
            "stored": 0,
            "needed": 0
        },
        "3": {
            "stored": 0,
            "needed": 0
        },
        "4": {
            "stored": 0,
            "needed": 0
        },
        "5": {
            "stored": 0,
            "needed": 0
        },
        "6": {
            "stored": 0,
            "needed": 0
        },
        "7": {
            "stored": 0,
            "needed": 0
        },
        "8": {
            "stored": 0,
            "needed": 0
        },
        "9": {
            "stored": 0,
            "needed": 0
        },
        "10": {
            "stored": 0,
            "needed": 0
        },
        "11": {
            "stored": 0,
            "needed": 0
        },
        "12": {
            "stored": 0,
            "needed": 0
        },
        "13": {
            "stored": 0,
            "needed": 0
        },
        "14": {
            "stored": 0,
            "needed": 0
        },
        "15": {
            "stored": 0,
            "needed": 0
        },
        "16": {
            "stored": 0,
            "needed": 0
        },
        "17": {
            "stored": 0,
            "needed": 0
        },
        "18": {
            "stored": 0,
            "needed": 0
        },
        "19": {
            "stored": 0,
            "needed": 0
        }
    },
    "finishId": 54,
    "entrances": {},
    "exits": {}
}`)
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
