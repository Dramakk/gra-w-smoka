import * as levelParser from './levelParser'

export abstract class Field {
    typeOfField: string;
    id: number;
    image: string;
    attributes: {direction : levelParser.Directions};
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
  constructor (direction: levelParser.Directions, image: string, id: number) {
    super()
    this.image = image
    this.attributes = { direction: direction }
    this.id = id
    this.typeOfField = 'ARROW'
  }
}
