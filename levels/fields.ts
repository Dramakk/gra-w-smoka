import { Directions } from './level'

export abstract class Field {
    typeOfField: string;
    id: number;
    image: string;
    isDragon: boolean
    attributes: {direction : Directions};

    hasDragon (): boolean {
      return this.isDragon
    }
}

export class Start extends Field {
  attributes: null

  constructor (image: string, id: number) {
    super()
    this.image = image
    this.id = id
    this.typeOfField = 'START'
  }
}

export class Finish extends Field {
    attributes: null

    constructor (image: string, id: number) {
      super()
      this.image = image
      this.id = id
      this.typeOfField = 'FINISH'
    }
}

export class Wall extends Field {
    attributes: null

    constructor (image: string, id: number) {
      super()
      this.image = image
      this.id = id
      this.typeOfField = 'WALL'
    }
}

export class Empty extends Field {
    attributes: null

    constructor (image: string, id: number) {
      super()
      this.image = image
      this.id = id
      this.typeOfField = 'EMPTY'
    }
}

export class Arrow extends Field {
  constructor (direction: Directions, image: string, id: number) {
    super()
    this.image = image
    this.attributes = { direction: direction }
    this.id = id
    this.typeOfField = 'ARROW'
  }
}
