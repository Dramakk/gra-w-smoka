import React, { ReactElement } from 'react'
import { GemColors } from '../../levels/level'
import GemControls from './GemControls'

type GemInfo = Record<GemColors, number>
export type GemOwner = 'SCALE' | 'TREE' | 'DRAGON'

export default function GemPanel (props: {scaleGems: GemInfo, gemsInPocket: GemInfo, treeGems: GemInfo, canEdit: boolean}): ReactElement {
  const gemColors: GemColors[] = ['RED', 'GREEN', 'BLUE', 'YELLOW', 'BLACK']

  return (
    <div className="gem-panel">
      <div className="gem-panel-header">
        <div>DRAGON</div>
        <div><img src='/images/scale_.png' alt='SCALE'/></div>
        <div>TREE</div>
      </div>
      {gemColors.map((gemColor, index) => {
        const howMany: Record<GemOwner, number> = { DRAGON: props.gemsInPocket[gemColor], SCALE: props.scaleGems[gemColor], TREE: props.treeGems[gemColor] }
        return <GemControls key={index} gemColor={gemColor} canEdit={props.canEdit} howMany={howMany} />
      })}
  </div>
  )
}
