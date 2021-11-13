import React, { ReactElement } from 'react'
import { Editor } from '../editor/editor'
import { add, Counter, counterDelete, items } from '../helpers/counter'
import { GadgetInfo, GadgetType } from '../levels/level'

// This class serves as builder for control panel, which allows to change the number of fields given to player
export class GadgetsSelectionComponent extends React.Component<{editor: Editor, initialGadgets: Counter<GadgetType>}, {gadgetsToPlaceByPlayer: Counter<GadgetType>}> {
  editorReference: Editor
  constructor (props: { editor: Editor, initialGadgets: Counter<GadgetType> }) {
    super(props)
    this.editorReference = this.props.editor
    this.state = { gadgetsToPlaceByPlayer: props.initialGadgets }
  }

  // Change quantity of field to be placed
  changeQty (gadgetType: GadgetType, changeInQty: number): void {
    if (changeInQty > 0) {
      this.editorReference.playerGadgets = add(this.editorReference.playerGadgets, gadgetType)
    }
    if (changeInQty < 0) {
      this.editorReference.playerGadgets = counterDelete(this.editorReference.playerGadgets, gadgetType)
    }
    this.setState({ gadgetsToPlaceByPlayer: this.editorReference.playerGadgets })
  }

  // Build selection component for one type of field.
  buildForField (gadgetInfo: GadgetInfo, index: number): ReactElement {
    return (
      <li key={index}>
        <p>{gadgetInfo[0]} {gadgetInfo[1]}</p>
        <button onClick={() => this.changeQty(gadgetInfo[0], 1)}>+</button>
        <button onClick={() => this.changeQty(gadgetInfo[0], -1)}>-</button>
      </li>
    )
  }

  render () : ReactElement {
    return (
      <div>
        Choose how many of given field you want to give to player.
        <ul>
          {[...items(this.state.gadgetsToPlaceByPlayer).entries()].map((gadgetInfo, index) => this.buildForField(gadgetInfo, index))}
        </ul>
      </div>
    )
  }
}
