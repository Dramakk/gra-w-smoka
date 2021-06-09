export interface Field{
    id: number;
    image: string;
    attributes: {direction : string};
    isPositionOfDragon: boolean;

    setAsDragonPosition (): void;
}

export class Finish implements Field {
    id: number;
    image: string;
    attributes: null
    isPositionOfDragon: boolean

    constructor (isPositionOfDragon: boolean, image: string, id: number) {
      this.image = image
      this.isPositionOfDragon = isPositionOfDragon
      this.id = id
    }

    setAsDragonPosition (): void {
      this.isPositionOfDragon = true
    }
}

export class Wall implements Field {
    id: number;
    image: string;
    attributes: null
    isPositionOfDragon: boolean

    constructor (isPositionOfDragon: boolean, image: string, id: number) {
      this.image = image
      this.isPositionOfDragon = isPositionOfDragon
      this.id = id
    }

    setAsDragonPosition (): void {
      this.isPositionOfDragon = true
    }
}

export class Empty implements Field {
    id: number;
    image: string;
    attributes: null
    isPositionOfDragon: boolean

    constructor (isPositionOfDragon: boolean, image: string, id: number) {
      this.image = image
      this.isPositionOfDragon = isPositionOfDragon
      this.id = id
    }

    setAsDragonPosition () {
      this.isPositionOfDragon = true
    }
}

export class Arrow implements Field {
    id: number;
    image: string;
    attributes: {direction: string}
    isPositionOfDragon: boolean

    constructor (isPositionOfDragon: boolean, direction: string, image: string, id: number) {
      this.image = image
      this.attributes = { direction: direction }
      this.isPositionOfDragon = isPositionOfDragon
      this.id = id
    }

    setAsDragonPosition () {
      this.isPositionOfDragon = true
    }
}
