import * as level from '../levels/level'
import * as fields from '../levels/fields'
import * as dragon from './dragon'
import ReactDOM from 'react-dom'
import React from 'react'
import { LevelViewBuilder } from '../views/levelBuilder'

export class Engine {
  level: level.Level;
  dragon: dragon.Dragon;
  loop: ReturnType<typeof setInterval>

  constructor (level : level.Level) {
    this.level = level
    this.dragon = new dragon.Dragon(this.level.getStartId())
  }

  gameStart () : void {
    /**
     * Starts simulation
     */
    this.loop = setInterval(this.gameLoop.bind(this), 1000)
  }

  gameStop () : void {
    /**
     * Stops simulation
     */
    clearInterval(this.loop)
  }

  gameReset () : void {
    /**
     * Stops simulation and resets dragon position.
     * Level (and placed fields) ramains unchanged.
     */
    this.gameStop()
    this.dragon = new dragon.Dragon(this.level.getStartId())
    ReactDOM.render(
      React.createElement(LevelViewBuilder, { engine: this }),
      document.getElementById('app-container')
    )
  }

  gameLoop () : void {
    if (this.dragon.canMove) {
      console.log(this.dragon.fieldId)
      this.move()
      this.changeState()
    } else {
      clearInterval(this.loop)
    }
    // Forcing component to update
    ReactDOM.render(
      React.createElement(LevelViewBuilder, { engine: this }),
      document.getElementById('app-container')
    )
  }

  move (): void {
    /**
     * Moves dragon to new field.
     */
    const newFieldId: number = this.calculateNewField()
    if (this.level.getField(newFieldId).typeOfField === 'WALL') {
      this.dragon.canMove = false
    } else {
      this.dragon.fieldId = newFieldId
    }
  }

  changeState (): void {
    /**
     * Changes dragon state based on field dragon is on.
     */
    const currentField: fields.Field = this.level.getField(this.dragon.fieldId)
    switch (currentField.typeOfField) {
      case 'ARROW':
        this.dragon.direction = currentField.attributes.direction
    }
  }

  private calculateNewField (): number {
    /**
     * Calculates new fieldId based on dragon direction.
     */
    let newFieldId: number = this.dragon.fieldId
    switch (this.dragon.direction) {
      case 'L':
        newFieldId -= 1
        break
      case 'R':
        newFieldId += 1
        break
      case 'U':
        newFieldId -= this.level.fieldsPerRow
        break
      case 'D':
        newFieldId += this.level.fieldsPerRow
        break
    }
    return newFieldId
  }
}
