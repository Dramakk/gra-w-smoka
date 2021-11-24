import { Directions, GadgetType, GemColors } from './level'

type FieldType = GadgetType | 'EMPTY'

// Type for possible field attributes
export interface ArrowAttributes { direction: Directions}
export interface ScaleAttributes { gemColor: GemColors}
export interface FinishAttributes { opened: boolean }
export interface ArithmeticOperationAttributes { targetGemColor: GemColors, numberOfGems: GemColors | number }

type FieldAttributes =
  | ArrowAttributes
  | ScaleAttributes
  | FinishAttributes
  | ArithmeticOperationAttributes

export interface Field {
    typeOfField: FieldType
    id: number
    image: string
    attributes?: FieldAttributes
}

export interface Start extends Field {
  typeOfField: 'START',
}

export interface Finish extends Field {
  typeOfField: 'FINISH',
  attributes: FinishAttributes
}

export interface Wall extends Field {
  typeOfField: 'WALL',
}

export interface Empty extends Field {
  typeOfField: 'EMPTY',
}

export interface Arrow extends Field {
  typeOfField: 'ARROWUP' | 'ARROWDOWN' | 'ARROWLEFT' | 'ARROWRIGHT',
  attributes: ArrowAttributes
}

export interface Scale extends Field {
  typeOfField: 'SCALE'
  attributes: ScaleAttributes
}

export interface ArithmeticOperation extends Field {
  typeOfField: 'ADDITION' | 'SUBSTRACTION' | 'MULTIPLICATION' | 'DIVISION'
  attributes: ArithmeticOperationAttributes
}

export function createField<T extends Field> (typeOfField: FieldType, image: string, id: number, attributes?: FieldAttributes): T {
  return { typeOfField, image, id, attributes } as T
}
