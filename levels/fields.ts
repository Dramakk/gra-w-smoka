type Directions = 'U' | 'L' | 'D' | 'R'
export abstract class Field {
    typeOfField: string;
    id: number;
    image: string;
    attributes: {direction : Directions};

    public static parseJSONToField (jsonObject: Record<string, any>): Field {
      if (jsonObject.isPositionOfDragon === null || jsonObject.image === null || jsonObject.id === null) {
        throw new Error('Parse error, when parsing' + JSON.stringify(jsonObject))
      }
      switch (jsonObject.typeOfField) {
        case 'FINISH':
          return new Finish(jsonObject.image, jsonObject.id)
        case 'WALL':
          return new Wall(jsonObject.image, jsonObject.id)
        case 'EMPTY':
          return new Empty(jsonObject.image, jsonObject.id)
        case 'ARROW':
          return new Arrow(jsonObject.attributes.direction, jsonObject.image, jsonObject.id)
        case 'START':
          return new Start(jsonObject.image, jsonObject.id)
      }
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
