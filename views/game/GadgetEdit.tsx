import React from 'react'
import { GadgetOptionKeys, GadgetOptionDescription } from '../../levels/level'
import Modal, { ButtonDescription } from '../helpers/Modal'

export type SelectedOptions = Partial<Record<GadgetOptionKeys, string | number>>

interface GadgetEditProps {
  buttons: ButtonDescription[]
  showModal: boolean
  options: GadgetOptionDescription
  changeSelectedOptions: (arg: SelectedOptions) => void
  selectedOptions: SelectedOptions
}
/*
  This component is used as edit window for all gadgets. Possible options and option selection handle
  must be provided in props. Currently it's used in two cases:
  - user selects gadget to place on board and has to select options
  - user clicks gadget that's already on the board and can decide to delete it or change it's options
*/
export default function GadgetEdit (props: GadgetEditProps): React.ReactElement {
  let dropdown = null

  // Update state to currently selected options.
  function updateSelectedOption (optionKey: string): (event: React.ChangeEvent<HTMLSelectElement>) => void {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      const parsedValue = parseInt(event.target.value)
      props.changeSelectedOptions({ ...props.selectedOptions, [optionKey]: isNaN(parsedValue) ? event.target.value : parsedValue })
    }
  }

  // Generate dropdown for options
  if (Object.keys(props.options).length) {
    dropdown = Object.keys(props.options).reduce((previousDropdown: React.ReactElement, optionKey: GadgetOptionKeys) => {
      return (
        <>
          {previousDropdown}
          <select onChange={updateSelectedOption(optionKey).bind(this)} value={props.selectedOptions[optionKey]}>
            {props.options[optionKey].map((value, index) => {
              return <option key={index} value={value}>{value}</option>
            })}
          </select>
        </>
      )
    }, null)
  }

  return (
    <Modal title='Wybierz opcje dla gadżetu' show={props.showModal} buttons={props.buttons}>
      <div>
        <div className='gadget-edit-picture'>
          Placeholder
        </div>
        <div className='gadget-edit-options'>
          {dropdown || <div className='gadget-edit-options-empty'>Brak opcji dla tego gadżetu</div>}
        </div>
      </div>
    </Modal>
  )
}
