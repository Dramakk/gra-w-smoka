import React from 'react'
import ReactDOM from 'react-dom'
import { Level } from './levels/level'
import * as levelViewBuilder from './levels/levelViewBuilder'

const simpleLevel = `{
    "fieldsPerRow": 4,
    "level": [
        {"id": 1, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},
        {"id": 2, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},
        {"id": 3, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},
        {"id": 4, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},

        {"id": 5, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},
        {"id": 6, "image": "S", "isPositionOfDragon": true, "typeOfField": "Empty"},
        {"id": 7, "image": "E", "isPositionOfDragon": false, "typeOfField": "Empty"},
        {"id": 8, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},

        {"id": 9, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},
        {"id": 10, "image": "E", "isPositionOfDragon": false, "typeOfField": "Empty"},
        {"id": 11, "image": "E", "isPositionOfDragon": false, "typeOfField": "Empty"},
        {"id": 12, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},

        {"id": 13, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},
        {"id": 14, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},
        {"id": 15, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"},
        {"id": 16, "image": "W", "isPositionOfDragon": false, "typeOfField": "Wall"}
    ]
}`
const level = new Level(simpleLevel)
const domContainer = document.querySelector('#board')
ReactDOM.render(<levelViewBuilder.LevelViewBuilder level={level} />, domContainer)
