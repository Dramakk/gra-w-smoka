type Directions = 'U' | 'L' | 'D' | 'R'
export abstract class Field {
    typeOfField: string;
    id: number;
    image: string;
    attributes: {direction : Directions};
    isPositionOfDragon: boolean;

    abstract setAsDragonPosition (): void;

    public static parseJSONToField (jsonObject: Record<string, any>): Field {
      if (jsonObject.isPositionOfDragon === null || jsonObject.image === null || jsonObject.id === null) {
        throw new Error('Parse error, when parsing' + JSON.stringify(jsonObject))
      }
      switch (jsonObject.typeOfField) {
        case 'Finish':
          return new Finish(jsonObject.isPositionOfDragon, jsonObject.image, jsonObject.id)
        case 'Wall':
          return new Wall(false, jsonObject.image, jsonObject.id)
        case 'Empty':
          return new Empty(jsonObject.isPositionOfDragon, jsonObject.image, jsonObject.id)
        case 'Arrow':
          return new Arrow(jsonObject.isPositionOfDragon, jsonObject.attributes.direction, jsonObject.image, jsonObject.id)
      }
    }
}

export class Finish extends Field {
    attributes: null

    constructor (isPositionOfDragon: boolean, image: string, id: number) {
      super()
      this.image = image
      this.isPositionOfDragon = isPositionOfDragon
      this.id = id
      this.typeOfField = 'Finish'
    }

    setAsDragonPosition (): void {
      this.isPositionOfDragon = true
    }
}

export class Wall extends Field {
    attributes: null

    constructor (isPositionOfDragon: boolean, image: string, id: number) {
      super()
      this.image = image
      this.isPositionOfDragon = isPositionOfDragon
      this.id = id
      this.typeOfField = 'Wall'
    }

    setAsDragonPosition (): void {
      this.isPositionOfDragon = false
    }
}

export class Empty extends Field {
    attributes: null

    constructor (isPositionOfDragon: boolean, image: string, id: number) {
      super()
      this.image = image
      this.isPositionOfDragon = isPositionOfDragon
      this.id = id
      this.typeOfField = 'Empty'
    }

    setAsDragonPosition (): void {
      this.isPositionOfDragon = true
    }
}

export class Arrow extends Field {
  constructor (isPositionOfDragon: boolean, direction: Directions, image: string, id: number) {
    super()
    this.image = image
    this.attributes = { direction: direction }
    this.isPositionOfDragon = isPositionOfDragon
    this.id = id
    this.typeOfField = 'Arrow'
  }

  setAsDragonPosition (): void {
    this.isPositionOfDragon = true
  }
}
