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

export default function GadgetEdit (props: GadgetEditProps): React.ReactElement {
  let dropdown = null

  // Update state to currently selected options.
  function updateSelectedOption (optionKey: string): (event: React.ChangeEvent<HTMLSelectElement>) => void {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      const parsedValue = parseInt(event.target.value)
      props.changeSelectedOptions({ ...props.selectedOptions, [optionKey]: isNaN(parsedValue) ? event.target.value : parsedValue })
    }
  }

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
