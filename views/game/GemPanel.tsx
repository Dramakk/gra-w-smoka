import React, { ReactElement } from 'react'
import { GemColors, GemColorsArray } from '../../levels/level'
import GemControls from './GemControls'

type GemInfo = Record<GemColors, number>
export type GemOwner = 'SCALE' | 'TREE' | 'DRAGON'

export default function GemPanel (props: {scaleGems: GemInfo, gemsInPocket: GemInfo, treeGems: GemInfo, canEdit: boolean}): ReactElement {
  return (
    <div className="gem-panel">
      <div className="gem-panel-header">
        <div><img src='/images/GEM_PANEL_DRAGON.png' alt='DRAGON'/></div>
        <div><img src='/images/GEM_PANEL_SCALE.png' alt='SCALE'/></div>
        <div><img src='/images/GEM_PANEL_TREE.png' alt='TREE'/></div>
      </div>
      {GemColorsArray.map((gemColor, index) => {
        const howMany: Record<GemOwner, number> = { DRAGON: props.gemsInPocket[gemColor], SCALE: props.scaleGems[gemColor], TREE: props.treeGems[gemColor] }
        return <GemControls key={index} gemColor={gemColor} canEdit={props.canEdit} howMany={howMany} />
      })}
  </div>
  )
}
