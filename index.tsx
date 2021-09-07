import React from 'react'
import ReactDOM from 'react-dom'
import { Engine } from './engine/engine'
import { GameComponent } from './views/game'
import { MainMenuComponent } from './views/mainMenu'
import './views/css/main.css'
import { parseLevel } from './levels/levelParser'
import { Editor } from './editor/editor'

const domContainer = document.querySelector('#app-container')
ReactDOM.render(<MainMenuComponent
  createGameView={(importedLevel: string) => {
    const level = parseLevel(JSON.parse(importedLevel))
    const game = new Engine(level)
    ReactDOM.render(<GameComponent engine={game} editorMode={false}/>, domContainer)
  }}
  createEditorView={(howManyRows: number, howManyPerRow: number) => {
    const editor = new Editor(howManyRows, howManyPerRow)
    const game = new Engine(editor.level)
    ReactDOM.render(<GameComponent engine={game} editorMode={true} editor={editor}
    />, domContainer)
  }} />, domContainer)
