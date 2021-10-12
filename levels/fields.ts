import { Directions, GadgetType } from './level'

type FieldType = GadgetType | 'EMPTY'

export interface Field {
    typeOfField: FieldType;
    id: number;
    image: string;
    attributes?: {direction? : Directions};
}

export interface Start extends Field {
  typeOfField: 'START',
}

export interface Finish extends Field {
  typeOfField: 'FINISH',
}

export interface Wall extends Field {
  typeOfField: 'WALL',
}
export interface Empty extends Field {
  typeOfField: 'EMPTY',
}
export interface Arrow extends Field {
  typeOfField: 'ARROWUP' | 'ARROWDOWN' | 'ARROWLEFT' | 'ARROWRIGHT',
  attributes: { direction: Directions }
}

export function createStart (image: string, id: number): Start {
  return { image: image, id: id, typeOfField: 'START' }
}

export function createFinish (image: string, id: number): Finish {
  return { image: image, id: id, typeOfField: 'FINISH' }
}

export function createWall (image: string, id: number): Wall {
  return { image: image, id: id, typeOfField: 'WALL' }
}

export function createEmpty (image: string, id: number): Empty {
  return { image: image, id: id, typeOfField: 'EMPTY' }
}

export function createArrow (direction: Directions, image: string, id: number): Arrow {
  let typeOfField: 'ARROWUP' | 'ARROWDOWN' | 'ARROWLEFT' | 'ARROWRIGHT' = 'ARROWUP'
  switch (direction) {
    case 'U':
      typeOfField = 'ARROWUP'
      break
    case 'D':
      typeOfField = 'ARROWDOWN'
      break
    case 'L':
      typeOfField = 'ARROWLEFT'
      break
    case 'R':
      typeOfField = 'ARROWRIGHT'
      break
  }

  return {
    id,
    typeOfField,
    image,
    attributes: { direction: direction }
  }
}
