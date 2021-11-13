import React from 'react'
import ReactDOM from 'react-dom'
import { EngineState, resetDragon } from './engine/engine'
import { Game } from './views/game'
import { MainMenu } from './views/mainMenu'
import './views/css/main.css'
import { parseLevel } from './levels/levelParser'
import { createEditor } from './editor/editor'

const domContainer = document.querySelector('#app-container')

// Here we either create game view or editor view. They use the same component, but with different values assigned.
ReactDOM.render(<MainMenu
  createGameView={(importedLevel: string) => {
    const level = parseLevel(JSON.parse(importedLevel))
    const game: EngineState = resetDragon({ level, dragon: null })
    ReactDOM.render(<Game engine={game} editorMode={false}/>, domContainer)
  }}
  createEditorView={(howManyRows: number, howManyPerRow: number) => {
    const editor = createEditor(howManyRows, howManyPerRow)
    const game = resetDragon({ level: editor.level, dragon: null })
    ReactDOM.render(<Game engine={game} editorMode={true} editor={editor}
    />, domContainer)
  }} />, domContainer)
