import React from 'react'
import ReactDOM from 'react-dom'
import { Level } from './levels/level'
import * as levelViewBuilder from './levels/levelViewBuilder'

const simpleLevel = 'W;W;W;W;W;S;E;W;W;AR;F;W;W;W;W;W'
const level = new Level(simpleLevel)

const domContainer = document.querySelector('#board')
ReactDOM.render(<levelViewBuilder.LevelViewBuilder level={level} />, domContainer)
