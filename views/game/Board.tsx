import React, { CSSProperties, ReactElement } from 'react'
import FieldComponent from './Field'
import { Level, LevelGetters } from '../../levels/level'
import { DragonDirectionHistory } from '../../engine/dragon'

interface BoardProps {
  dragonPosition: number;
  level: Level;
  editorMode: boolean;
  isMoving: boolean;
  isStuck: boolean;
  dragonDirectionHistory: DragonDirectionHistory;
  timeout: number;
}

export default function BoardComponent (props:BoardProps): ReactElement {
  const rowCount = LevelGetters.getRowCount(props.level)
  const fieldsPerRow = LevelGetters.getFieldsPerRow(props.level)
  const calculatedStyles: CSSProperties = {
    gridTemplateColumns: `repeat(${fieldsPerRow}, 64px)`,
    gridTemplateRows: `repeat(${rowCount}, 64px)`,
    width: `calc(${fieldsPerRow} * 64.5px)`
  }
  const board = [...Array(LevelGetters.getLevelSize(props.level)).keys()]
    .map(index => { return LevelGetters.getField(props.level, index) })

  return (
    <div className='board-container' style={calculatedStyles}>
        {[...Array(fieldsPerRow * rowCount).keys()].map((fieldIndex: number) => {
          const field = board[fieldIndex]
          return <FieldComponent timeout={props.timeout} isMoving={props.isMoving} isStuck={props.isStuck} displayDragon={field.id === props.dragonPosition} dragonDirectionHistory={props.dragonDirectionHistory} key={field.id} field={field} />
        })}
      </div>
  )
}
