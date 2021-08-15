import { Field } from '../levels/fields'
import { Level } from '../levels/level'
import { Dragon } from './dragon'

export class Engine {
  level: Level;
  dragon: Dragon;
  loop: ReturnType<typeof setInterval>;

  constructor (level: Level) {
    this.level = level
    this.dragon = new Dragon(this.level.start.position, this.level.start.direction)
  }

  resetDragon (): void {
    this.dragon = new Dragon(this.level.start.position, this.level.start.direction)
  }

  gameLoop (): boolean {
    if (!this.move()) {
      return false
    }

    this.changeState()

    return true
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
    const currentField: Field = this.level.getField(this.dragon.fieldId)
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
