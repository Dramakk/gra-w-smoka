import React from 'react'
import { TreeRegisters } from '../levels/level'

export function Tree (props: { treeRegisters: TreeRegisters, isEditor: boolean}): React.ReactElement {
  return (
    <div>{JSON.stringify(props.treeRegisters)}</div>
  )
}
