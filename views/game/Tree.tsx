import React from 'react'
import { TreeRegisters } from '../../levels/level'
import TreeValue from './TreeValue'

export default function Tree (props: { treeRegisters: TreeRegisters, canEdit: boolean}): React.ReactElement {
  return (
    <div className="tree-registers-container">
      {Object.keys(props.treeRegisters).map(key => {
        const parsedKey = parseInt(key)
        return (
          <div key={parsedKey} className="single-register">
            <div className="single-register-number">
              {parsedKey}
            </div>
            <TreeValue
              canEdit={props.canEdit}
              registerNumber={parsedKey}
              needed={props.treeRegisters[parsedKey].needed}
              stored={props.treeRegisters[parsedKey].stored}
            />
          </div>
        )
      })}
    </div>
  )
}
