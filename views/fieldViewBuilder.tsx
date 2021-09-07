import React, { ReactElement } from 'react'

export class FieldView extends React.Component<{ id: number, hasDragon: boolean, image: string, fieldUpdate : (index : number) => void}> {
  render () : ReactElement {
    let className = 'board-cell';
    if (this.props.hasDragon) {
      className += ' has-dragon';
    }
    return (
      <div onClick={() => this.props.fieldUpdate(this.props.id)} className={className}>
        <span className='board-cell-number'>{this.props.id}</span>
        {this.props.image}
      </div>
    )
  }
}
