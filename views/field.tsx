import React from 'react'
import { DispatchProps } from '../state_manager/reducer'

interface FieldProps extends DispatchProps { id: number, image: string}

export function FieldComponent (props: FieldProps): React.ReactElement {
  return (
    <div onClick={() => props.dispatch({ type: 'FIELD_CLICK', payload: { index: props.id } })} className='col-lg'>
      {props.image}
    </div>
  )
}
