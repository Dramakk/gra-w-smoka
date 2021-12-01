import * as fields from '../../levels/fields'
import React, { CSSProperties, ReactElement } from 'react'
import FieldComponent from './Field'

interface BoardProps {
  dragonPosition: number;
  board: fields.Field[];
  rowCount: number;
  fieldsPerRow: number;
}

export default function BoardComponent (props:BoardProps): ReactElement {
  const calculatedStyles: CSSProperties = {
    gridTemplateColumns: `repeat(${props.fieldsPerRow}, 1fr)`,
    gridTemplateRows: `repeat(${props.rowCount}, 1fr)`
  }
  function getImage (field: fields.Field): string {
    if (field.id === props.dragonPosition) {
      return 'S'
    } else {
      return field.image
    }
  }

  return (
    <div className='board-container' style={calculatedStyles}>
        {[...Array(props.fieldsPerRow * props.rowCount).keys()].map((fieldIndex: number) => {
          const field = props.board[fieldIndex]
          return <FieldComponent key={field.id} id={field.id} image={getImage(field)} />
        })}
      </div>
  )
}
