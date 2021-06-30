import * as level from '../levels/level'
import * as fields from '../levels/fields'
import * as dragon from './dragon'
import { LevelViewBuilder } from '../views/levelBuilder'

export class Engine {
  // This holds a reference to rendered component in order to update view every tick.
  levelViewComponentRef : LevelViewBuilder
  level: level.Level;
  dragon: dragon.Dragon;
  loop: ReturnType<typeof setInterval>

  constructor (level : level.Level) {
    this.level = level
    this.dragon = new dragon.Dragon(this.level.getStartId(), this.level.getStartDirection())
  }

  setLevelViewComponentRef (levelViewComponentRef : LevelViewBuilder) : void {
    this.levelViewComponentRef = levelViewComponentRef
  }

  // Starts simulation with 1s interval
  gameStart () : void {
    // Check if dragon position is set. Invalid dragon position is possible during level creation.
    if (!(this.level.getStartId() === null || this.level.getStartDirection() === null)) {
      this.loop = setInterval(this.gameLoop.bind(this), 1000)
    }
  }

  // Stops simulation
  gameStop () : void {
    clearInterval(this.loop)
  }

  // Stops simulation and resets dragon position.
  // Level (and placed fields) ramains unchanged.
  gameReset () : void {
    this.gameStop()
    this.dragon = new dragon.Dragon(this.level.getStartId(), this.level.getStartDirection())
    this.levelViewComponentRef.updateComponentStateAfterMove(this.level)
  }

  gameLoop () : void {
    if (this.move()) {
      this.changeState()
    } else {
      clearInterval(this.loop)
    }
    // Forcing component to update
    this.levelViewComponentRef.updateComponentStateAfterMove(this.level)
  }

  // Moves dragon to new field (returns false if dragon cant move)
  move (): boolean {
    const newFieldId: number = this.calculateNewField()
    if (this.level.getField(newFieldId).typeOfField === 'WALL') {
      return false
    } else {
      this.dragon.fieldId = newFieldId
      return true
    }
  }

  // Changes dragon state based on field dragon is on.
  changeState (): void {
    const currentField: fields.Field = this.level.getField(this.dragon.fieldId)
    switch (currentField.typeOfField) {
      case 'ARROW':
        this.dragon.direction = currentField.attributes.direction
    }
  }

  // Calculates new fieldId based on dragon direction.
  private calculateNewField (): number {
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
