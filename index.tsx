import React from 'react'
import ReactDOM from 'react-dom'
import { Engine } from './engine/engine'
import { LevelViewBuilder } from './views/levelBuilder'
import { MainMenuView } from './views/mainMenuBuilder'
import './views/css/main.css'
import { LevelParser } from './levels/levelParser'
import { EditorViewBuilder } from './views/editorBuilder'

const simpleLevel = JSON.parse(`{
    "fieldsPerRow": 4,
    "start": {"position": 5, "direction": "R"},
    "fieldsToPlace": [
        {"fieldType": "ARROWLEFT", "howManyAvailable": 1},
        {"fieldType": "ARROWUP", "howManyAvailable": 1},
        {"fieldType": "ARROWRIGHT", "howManyAvailable": 1},
        {"fieldType": "ARROWDOWN", "howManyAvailable": 1}
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
    ]
}`)

const level = LevelParser.getParsedLevel(simpleLevel)
const game = new Engine(level)
const domContainer = document.querySelector('#app-container')
ReactDOM.render(<MainMenuView
  createGameView={ () => {
    ReactDOM.render(<LevelViewBuilder engine={ game }
    ref= {
      (element) => { game.setLevelViewComponentRef(element) }
    } />, domContainer)
  } }
  createEditorView={ () => {
    const game = new Engine(LevelParser.createLevelForEditor(5, 4))
    ReactDOM.render(<EditorViewBuilder engine= { game }
      ref= {
        (element) => { game.setLevelViewComponentRef(element) }
      } />, domContainer)
  }}/>, domContainer)
