import React from 'react'
import ReactDOM from 'react-dom'
import { Level } from './levels/level'
import * as levelBuilder from './views/levelBuilder'
import * as mainMenuBuilder from './views/mainMenuBuilder'
import './views/css/main.css'

const simpleLevel = `{
    "fieldsPerRow": 4,
    "fieldsToPlace": [
        {"fieldType": "ARROWLEFT", "howManyAvailable": 1},
        {"fieldType": "ARROWUP", "howManyAvailable": 1},
        {"fieldType": "ARROWRIGHT", "howManyAvailable": 1}
    ],
    "level": [
        {"id": 0, "image": "W", "typeOfField": "WALL"},
        {"id": 1, "image": "W", "typeOfField": "WALL"},
        {"id": 2, "image": "W", "typeOfField": "WALL"},
        {"id": 3, "image": "W", "typeOfField": "WALL"},

        {"id": 4, "image": "W", "typeOfField": "WALL"},
        {"id": 5, "image": "S", "typeOfField": "START"},
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
}`
const level = new Level(simpleLevel)
console.log(level)
const domContainer = document.querySelector('#app-container')
ReactDOM.render(<mainMenuBuilder.MainMenuView onClick={() => { ReactDOM.render(<levelBuilder.LevelViewBuilder level={level} />, domContainer); return true }}/>, domContainer)
