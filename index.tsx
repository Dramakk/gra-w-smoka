import React from 'react'
import ReactDOM from 'react-dom'
import { Engine } from './engine/engine'
import { LevelViewBuilder } from './views/levelBuilder'
import { MainMenuView } from './views/mainMenuBuilder'
import './views/css/main.css'
import { LevelParser } from './levels/levelParser'
import { EditorViewBuilder } from './views/editorBuilder'

const domContainer = document.querySelector('#app-container')
ReactDOM.render(<MainMenuView
  createGameView={ (importedLevel : string) => {
    const level = LevelParser.getParsedLevel(JSON.parse(importedLevel))
    const game = new Engine(level)
    ReactDOM.render(<LevelViewBuilder engine={ game }
    ref= {
      (element) => { game.setLevelViewComponentRef(element) }
    } />, domContainer)
  } }
  createEditorView={ (howManyRows: number, howManyPerRow: number) => {
    const game = new Engine(LevelParser.createLevelForEditor(howManyRows, howManyPerRow))
    ReactDOM.render(<EditorViewBuilder engine= { game }
      ref= {
        (element) => { game.setLevelViewComponentRef(element) }
      } />, domContainer)
  }}/>, domContainer)
