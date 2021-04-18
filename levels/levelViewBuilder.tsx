import * as fields from './fields'
import * as level from './level'
import React from 'react'
import ReactDOM from 'react-dom'

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
  cellsPerRow: number = 4

  buildRow (fields: fields.Field[], rowNumber: number) {
    return (
      <div key={rowNumber} className='row'>
        {fields.map(field => <FieldView key={field.id} id={field.id} image={field.image} />)}
      </div>
    )
  }

  render () {
    const iterations: number[] = []
    for (let i: number = 0; i < this.levelSize / this.cellsPerRow; i++) {
      iterations.push(i)
    }

    return (
       <div className='container'>
         {iterations.map(rowNumber => this.buildRow(this.levelFields.slice(rowNumber * this.cellsPerRow, (rowNumber + 1) * this.cellsPerRow), rowNumber))}
       </div>
    )
  }
}
