import { Directions, GadgetOptionDescription, GadgetType, GemColors, GemColorsArray, Labels, LabelsArray, Signs, SignsArray } from './level'

type FieldType = GadgetType | 'EMPTY'

// Type for possible field attributes
export interface ArrowAttributes { direction: Directions}
export interface ScaleAttributes { gemColor: GemColors}
export interface FinishAttributes { opened: number }
export interface ArithmeticOperationAttributes { targetGemColor: GemColors, numberOfGems: GemColors | number }
export interface SwapOperationAttributes { firstGemColor: GemColors, secondGemColor: GemColors }
export interface RegisterOperationAttributes {targetGemColor: GemColors, registerNumber: GemColors | number}
export interface IfAttributes {leftGemColor: GemColors, sign: Signs, rightNumberOfGems: GemColors | number}
export interface ExitAttributes { label: Labels }
export interface EntranceAttributes {label: Labels, exit: number}

type FieldAttributes =
  | ArrowAttributes
  | ScaleAttributes
  | FinishAttributes
  | ArithmeticOperationAttributes
  | SwapOperationAttributes
  | RegisterOperationAttributes
  | IfAttributes
  | ExitAttributes
  | EntranceAttributes

export interface Field {
    typeOfField: FieldType
    id: number
    image: string
    attributes?: FieldAttributes
}

export interface Start extends Field {
  typeOfField: 'START'
}

export interface Finish extends Field {
  typeOfField: 'FINISH'
  attributes: FinishAttributes
}

export interface Wall extends Field {
  typeOfField: 'WALL'
}

export interface Empty extends Field {
  typeOfField: 'EMPTY'
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
  typeOfField: 'ADD' | 'SUBSTRACT' | 'MULTIPLY' | 'DIVIDE' | 'SET'
  attributes: ArithmeticOperationAttributes
}

export interface Swap extends Field {
  typeOfField: 'SWAP'
  attributes: SwapOperationAttributes
}

export interface RegisterOperation extends Field {
  typeofField: 'TAKE' | 'STORE'
  attributes: RegisterOperationAttributes
}

export interface If extends Field {
  typeofField: 'IF'
  attributes: IfAttributes
}

export interface Entrance extends Field {
  typeofField: 'ENTRANCE'
  attributes: EntranceAttributes
}

export interface Exit extends Field {
  typeofField: 'EXIT'
  attributes: ExitAttributes
}

export function createField<T extends Field> (typeOfField: FieldType, image: string, id: number, attributes?: FieldAttributes): T {
  return { typeOfField, image, id, attributes } as T
}

// This function generates options record for given gadget.
// These informations are used to render options to choose from in editor mode.
export function generateGadgetDescription (gadgetType: GadgetType): GadgetOptionDescription {
  switch (gadgetType) {
    case 'START':
      return {
        direction: ['D', 'U', 'L', 'R']
      }
    case 'SCALE':
      return {
        gemColor: [...GemColorsArray]
      }
    case 'ADD':
    case 'SUBSTRACT':
    case 'DIVIDE':
    case 'MULTIPLY':
    case 'SET':
      return {
        targetGemColor: [...GemColorsArray],
        numberOfGems: [...GemColorsArray, ...new Array(20).keys()]
      }
    case 'SWAP':
      return {
        firstGemColor: [...GemColorsArray],
        secondGemColor: [...GemColorsArray]
      }
    case 'TAKE':
    case 'STORE':
      return {
        targetGemColor: [...GemColorsArray],
        registerNumber: [...GemColorsArray, ...new Array(20).keys()]
      }
    case 'IF':
      return {
        leftGemColor: [...GemColorsArray],
        sign: [...SignsArray],
        rightNumberOfGems: [...GemColorsArray, ...new Array(20).keys()]
      }
    case 'ENTRANCE':
    case 'EXIT':
      return {
        label: [...LabelsArray]
      }
    default:
      return {}
  }
}
