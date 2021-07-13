import React from 'react'
import ReactDOM from 'react-dom'
import { Engine } from './engine/engine'
import { LevelViewBuilder } from './views/levelBuilder'
import { MainMenuView } from './views/mainMenuBuilder'
import './views/css/main.css'
import { parseLevel, createLevelForEditor } from './levels/levelParser'
import { EditorViewBuilder } from './views/editorBuilder'

const domContainer = document.querySelector('#app-container')
ReactDOM.render(<MainMenuView
  createGameView={ (importedLevel : string) => {
    const level = parseLevel(JSON.parse(importedLevel))
    const game = new Engine(level)
    ReactDOM.render(<LevelViewBuilder engine={ game } placeElement={undefined} deleteElement={undefined}
    />, domContainer)
  } }
  createEditorView={ (howManyRows: number, howManyPerRow: number) => {
    const game = new Engine(createLevelForEditor(howManyRows, howManyPerRow))
    ReactDOM.render(<EditorViewBuilder engine= { game }
    />, domContainer)
  }}/>, domContainer)
