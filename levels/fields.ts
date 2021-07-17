import { Directions, GadgetType } from './level'

type FieldType = GadgetType | 'EMPTY'

export abstract class Field {
    typeOfField: FieldType;
    id: number;
    image: string;
    attributes: {direction : Directions};
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
    switch (direction) {
      case 'U':
        this.typeOfField = 'ARROWUP'
        break
      case 'D':
        this.typeOfField = 'ARROWDOWN'
        break
      case 'L':
        this.typeOfField = 'ARROWLEFT'
        break
      case 'R':
        this.typeOfField = 'ARROWRIGHT'
        break
    }
  }
}
