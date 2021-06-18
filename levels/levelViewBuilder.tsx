import * as fields from './fields'
import * as level from './level'
import React, { ReactElement } from 'react'

class FieldView extends React.Component<{ id: number, image: string }, { isDragonPosition: boolean}> {
  render () {
    return (
      <div className='col-lg'>
        {this.props.image}
      </div>
    )
  }
}

export class LevelViewBuilder extends React.Component<{level: level.Level}> {
  levelFields: fields.Field[] = this.props.level.getFields()
  levelSize: number = this.levelFields.length
  cellsPerRow = this.props.level.getFieldsPerRow()

  buildRow (fields: fields.Field[], rowNumber: number): ReactElement {
    return (
      <div key={rowNumber} className='row'>
        {fields.map(field => <FieldView key={field.id} id={field.id} image={field.image} />)}
      </div>
    )
  }

  render () : ReactElement {
    const iterations: number[] = []
    for (let i = 0; i < this.levelSize / this.cellsPerRow; i++) {
      iterations.push(i)
    }

    return (
       <div className='container'>
         {iterations.map(rowNumber => this.buildRow(this.levelFields.slice(rowNumber * this.cellsPerRow, (rowNumber + 1) * this.cellsPerRow), rowNumber))}
       </div>
    )
  }
}
