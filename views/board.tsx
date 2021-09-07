import * as fields from '../levels/fields'
import React, { ReactElement } from 'react'
import { FieldComponent } from './field'

interface BoardProps {
  dragonPosition: number;
  board: fields.Field[];
  rowCount: number;
  fieldsPerRow: number;
  fieldPlacementController: (index: number) => void;
}

export class BoardComponent extends React.Component<BoardProps> {
  getImage (field: fields.Field): string {
    if (field.id === this.props.dragonPosition) {
      return 'S'
    } else {
      return field.image
    }
  }

  buildRow (rowNumber: number, fieldUpdate: (index: number) => void): ReactElement {
    const offset = rowNumber * this.props.fieldsPerRow

    return (
      <div key={rowNumber} className='row'>
        {[...Array(this.props.fieldsPerRow).keys()].map((fieldIndex: number) => {
          const field = this.props.board[offset + fieldIndex]
          return <FieldComponent key={field.id} id={field.id} image={this.getImage(field)} fieldUpdate={fieldUpdate} />
        })}
      </div>
    )
  }

  render (): ReactElement {
    return (
      <div className='board-container'>
        {[...Array(this.props.rowCount).keys()].map(rowNumber => this.buildRow(rowNumber, this.props.fieldPlacementController))}
      </div>
    )
  }
}
