import * as level from '../levels/level'
import * as fields from '../levels/fields'
import * as dragon from './dragon'

export class Engine {
  level: level.Level;
  dragon: dragon.Dragon;

  constructor (level : level.Level) {
    this.level = level
    this.dragon = new dragon.Dragon(5)
  }

  gameLoop () : void {
    const loop = setInterval(() => {
      // TODO: add return jak się wejdzie w ścianę
      console.log(this.dragon.fieldId)
      if (this.dragon.canMove) {
        this.move()
        this.changeState()
      } else {
        clearInterval(loop)
        console.log('Wall!')
      }
    }, 1000)
  }

  move (): void {
    const newFieldId: number = this.calculateNewField()
    if (this.level.getField(newFieldId) instanceof fields.Wall) {
      this.dragon.canMove = false
    } else {
      this.dragon.fieldId = newFieldId
      this.level.dragonPositionId = newFieldId
    }
  }

  changeState (): void {
    // TODO:
    // na razie if-else w połączeniu z instanceof
    // można zmienić na switch w przyszłości, wymaga zmiany klasy pola (dodanie właściwości opisującej klasę pola)
    const currenField: fields.Field = this.level.getField(this.level.dragonPositionId)
    if (currenField instanceof fields.Arrow) {
      this.dragon.direction = currenField.attributes.direction
    }
  }

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
