import React, { CSSProperties, ReactElement } from 'react'
import FieldComponent from './Field'
import { Directions, Level, LevelGetters } from '../../levels/level'

interface BoardProps {
  dragonPosition: number;
  level: Level;
  editorMode: boolean;
  isMoving: boolean;
  dragonDirectionHistory: {
    previous: Directions;
    current: Directions;
  };
}

export default function BoardComponent (props:BoardProps): ReactElement {
  const rowCount = LevelGetters.getRowCount(props.level)
  const fieldsPerRow = LevelGetters.getFieldsPerRow(props.level)
  const calculatedStyles: CSSProperties = {
    gridTemplateColumns: `repeat(${fieldsPerRow}, 64px)`,
    gridTemplateRows: `repeat(${rowCount}, 64px)`
  }
  const board = [...Array(LevelGetters.getLevelSize(props.level)).keys()]
    .map(index => { return LevelGetters.getField(props.level, index) })

  return (
    <div className='board-container' style={calculatedStyles}>
        {[...Array(fieldsPerRow * rowCount).keys()].map((fieldIndex: number) => {
          const field = board[fieldIndex]
          return <FieldComponent isMoving={props.isMoving} displayDragon={field.id === props.dragonPosition} dragonDirectionHistory={props.dragonDirectionHistory} key={field.id} field={field} />
        })}
      </div>
  )
}
