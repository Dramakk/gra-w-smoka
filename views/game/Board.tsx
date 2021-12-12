import * as fields from '../../levels/fields'
import React, { CSSProperties, ReactElement } from 'react'
import FieldComponent from './Field'
import { Directions } from '../../levels/level'

interface BoardProps {
  dragonPosition: number;
  board: fields.Field[];
  rowCount: number;
  fieldsPerRow: number;
  dragonDirectionHistory: {
    previous: Directions;
    current: Directions;
  };
}

export default function BoardComponent (props:BoardProps): ReactElement {
  const calculatedStyles: CSSProperties = {
    gridTemplateColumns: `repeat(${props.fieldsPerRow}, 1fr)`,
    gridTemplateRows: `repeat(${props.rowCount}, 1fr)`
  }

  return (
    <div className='board-container' style={calculatedStyles}>
        {[...Array(props.fieldsPerRow * props.rowCount).keys()].map((fieldIndex: number) => {
          const field = props.board[fieldIndex]
          return <FieldComponent displayDragon={field.id === props.dragonPosition} dragonDirectionHistory={props.dragonDirectionHistory} key={field.id} field={field} />
        })}
      </div>
  )
}
