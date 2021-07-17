import * as level from '../levels/level'
import * as fields from '../levels/fields'
import * as dragon from './dragon'

export class Engine {
  level: level.Level;
  dragon: dragon.Dragon;
  loop: ReturnType<typeof setInterval>

  constructor (level : level.Level) {
    this.level = level
    this.dragon = new dragon.Dragon(this.level.start.position, this.level.start.direction)
  }

  // Starts simulation with 1s interval
  gameStart () : void {
    // Check if dragon position is set. Invalid dragon position is possible during level creation.
    if (!this.level.start) {
      // Just don't start the game
      return
    }

    this.loop = setInterval(this.gameLoop.bind(this), 1000)
  }

  // Stops simulation
  gameStop () : void {
    clearInterval(this.loop)
  }

  // Stops simulation and resets dragon position.
  // Level (and placed fields) ramains unchanged.
  gameReset () : void {
    this.gameStop()
    this.dragon = new dragon.Dragon(this.level.start.position, this.level.start.direction)
  }

  gameLoop () : void {
    if (this.move()) {
      this.changeState()
    } else {
      clearInterval(this.loop)
    }
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
      // Again we have to handle all arrows separetly because of typeOfField definition.
      case 'ARROWUP':
        this.dragon.direction = 'U'
        break
      case 'ARROWDOWN':
        this.dragon.direction = 'D'
        break
      case 'ARROWLEFT':
        this.dragon.direction = 'L'
        break
      case 'ARROWRIGHT':
        this.dragon.direction = 'R'
        break
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
