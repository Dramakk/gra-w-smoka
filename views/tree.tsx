import React from 'react'
import { TreeRegisters } from '../levels/level'

export function Tree (props: { treeRegisters: TreeRegisters, canEdit: boolean}): React.ReactElement {
  return (
    <div className="tree-registers-container">
      {Object.keys(props.treeRegisters).map(key => {
        const parsedKey = parseInt(key)
        return (
          <div key={parsedKey} className="single-register">
            <div className="single-register-number">
              {parsedKey}
            </div>
            <div className="single-register-data">
              {props.treeRegisters[parsedKey].needed}
              {props.treeRegisters[parsedKey].stored}
            </div>
          </div>
        )
      })}
    </div>
  )
}
