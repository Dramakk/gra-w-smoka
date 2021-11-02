import * as fields from '../levels/fields'
import React, { ReactElement } from 'react'
import { FieldComponent } from './field'
import { DispatchProps } from '../state_manager/reducer'

interface BoardProps extends DispatchProps {
  dragonPosition: number;
  board: fields.Field[];
  rowCount: number;
  fieldsPerRow: number;
}

export function BoardComponent (props:BoardProps): ReactElement {
  function getImage (field: fields.Field): string {
    if (field.id === props.dragonPosition) {
      return 'S'
    } else {
      return field.image
    }
  }

  function buildRow (rowNumber: number): ReactElement {
    const offset = rowNumber * props.fieldsPerRow

    return (
      <div key={rowNumber} className='row'>
        {[...Array(props.fieldsPerRow).keys()].map((fieldIndex: number) => {
          const field = props.board[offset + fieldIndex]
          return <FieldComponent key={field.id} id={field.id} image={getImage(field)} dispatch={props.dispatch} />
        })}
      </div>
    )
  }

  return (
      <div className='board-container'>
        {[...Array(props.rowCount).keys()].map(rowNumber => buildRow(rowNumber))}
      </div>
  )
}
