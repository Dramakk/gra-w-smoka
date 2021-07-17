import React, { ReactElement } from 'react'

export class FieldView extends React.Component<{ id: number, image: string, fieldUpdate : (index : number) => void}> {
  render () : ReactElement {
    return (
      <div onClick={() => this.props.fieldUpdate(this.props.id)} className='col-lg'>
        {this.props.image}
      </div>
    )
  }
}
