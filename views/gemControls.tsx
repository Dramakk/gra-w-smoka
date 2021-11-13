import React, { ReactElement, useContext } from 'react'
import { GemColors } from '../levels/level'
import { DispatchContext } from './game'

export function GemControls (props: {who: 'TREE' | 'DRAGON'}): ReactElement {
  const dispatch = useContext(DispatchContext)
  const gemColors: GemColors[] = ['RED', 'BLUE', 'BLACK', 'YELLOW', 'GREEN']

  // Build selection component for one type of field.
  function buildForField (gemColor: GemColors, index: number): ReactElement {
    return (
      <li key={index}>
        <p>{gemColor}</p>
        <button onClick={() => dispatch({ type: 'CHANGE_GEM_QTY', payload: { who: props.who, color: gemColor, changeInQty: 1 } })}>+</button>
        <button onClick={() => dispatch({ type: 'CHANGE_GEM_QTY', payload: { who: props.who, color: gemColor, changeInQty: -1 } })}>-</button>
      </li>
    )
  }

  return (
    <div>
      Set gems for {props.who}
      <ul>
        {gemColors.map((gemColor, index) => buildForField(gemColor, index))}
      </ul>
    </div>
  )
}
