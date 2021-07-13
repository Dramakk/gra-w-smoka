import React, { ReactElement } from 'react'
import { Editor } from '../editor/editor'
import { Multiset } from '../helpers/multiset'
import { GadgetInfo, GadgetType } from '../levels/level'

// This class serves as builder for control panel, which allows to change the number of fields given to player
export class FieldsToPlaceSelectionView extends React.Component<{editor: Editor, initialGadgets: Multiset<GadgetType>}, {gadgetsToPlaceByPlayer: Multiset<GadgetType>}> {
  editorReference: Editor
  constructor (props: { editor: Editor, initialGadgets: Multiset<GadgetType> }) {
    super(props)
    this.editorReference = this.props.editor
    this.state = { gadgetsToPlaceByPlayer: props.initialGadgets }
  }

  // Change quantity of field to be placed
  changeQty (gadgetType: GadgetType, changeInQty: number): void {
    if (changeInQty > 0) {
      this.editorReference.gadgetsToPlaceByPlayer.add(gadgetType)
    }
    if (changeInQty < 0) {
      this.editorReference.gadgetsToPlaceByPlayer.delete(gadgetType)
    }
    this.setState({ gadgetsToPlaceByPlayer: this.editorReference.gadgetsToPlaceByPlayer })
  }

  // Build selection component for one type of field.
  buildForField (gadgetInfo: GadgetInfo): ReactElement {
    return (
      <li>
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
          {this.state.gadgetsToPlaceByPlayer.toArray().map((gadgetInfo) => this.buildForField(gadgetInfo))}
        </ul>
      </div>
    )
  }
}
