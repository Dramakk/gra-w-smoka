import React, { useContext } from 'react'
import { DispatchContext } from './game'

interface FieldProps { id: number, image: string}

export function FieldComponent (props: FieldProps): React.ReactElement {
  const dispatch = useContext(DispatchContext)

  return (
    <div onClick={() => dispatch({ type: 'FIELD_CLICK', payload: { index: props.id } })} className='board-field'>
      {props.image}
    </div>
  )
}
