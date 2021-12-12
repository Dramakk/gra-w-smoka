import React, { useContext } from 'react'
import { GadgetOptionKeys, GadgetType } from '../../levels/level'
import { GadgetEditState } from '../../state_manager/reducer'
import Modal, { ButtonDescription } from '../helpers/Modal'
import { DispatchContext } from './Game'

export type SelectedOptions = Partial<Record<GadgetOptionKeys, string | number>>

interface GadgetEditProps {
  state: GadgetEditState
  selectedGadget: GadgetType
  selectedOptions: SelectedOptions
}
/*
  This component is used as edit window for all gadgets. Possible options and option selection handle
  must be provided in props. Currently it's used in two cases:
  - user selects gadget to place on board and has to select options
  - user clicks gadget that's already on the board and can decide to delete it or change it's options
*/
export default function GadgetEdit (props: GadgetEditProps): React.ReactElement {
  const dispatch = useContext(DispatchContext)
  let dropdown = null
  const modalButtons: ButtonDescription[] = [
    {
      buttonText: 'Zamknij',
      buttonType: 'primary',
      onClick: () => dispatch({ type: 'CLEAR_UI_STATE' })

    }
  ]

  if (Object.keys(props.state.availableOptions).length !== 0) {
    modalButtons.push({
      buttonText: 'Zatwierdź',
      buttonType: 'success',
      onClick: () => {
        dispatch({ type: 'COMMIT_EDIT' })
      }
    })
  }

  if (props.state.canEdit) {
    modalButtons.unshift({
      buttonText: 'Usuń',
      buttonType: 'danger',
      onClick: () => {
        dispatch({ type: 'DELETE_FIELD', payload: { index: props.state.fieldId } })
      }
    })
  }
  // Update state to currently selected options.
  function updateSelectedOption (optionKey: string): (event: React.ChangeEvent<HTMLSelectElement>) => void {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      const parsedValue = parseInt(event.target.value)
      dispatch({ type: 'SELECT_OPTIONS', payload: { selectedOptions: { ...props.selectedOptions, [optionKey]: isNaN(parsedValue) ? event.target.value : parsedValue } } })
    }
  }

  // Generate dropdown for options
  if (Object.keys(props.state.availableOptions).length) {
    dropdown = Object.keys(props.state.availableOptions).reduce((previousDropdown: React.ReactElement, optionKey: GadgetOptionKeys) => {
      return (
        <>
          {previousDropdown}
          <select onChange={updateSelectedOption(optionKey).bind(this)} value={props.selectedOptions[optionKey]}>
            {props.state.availableOptions[optionKey].map((value, index) => {
              return <option key={index} value={value}>{value}</option>
            })}
          </select>
        </>
      )
    }, null)
  }

  return (
    <Modal title='Wybierz opcje dla gadżetu' show={props.state.showModal} buttons={modalButtons}>
      <div className='gadget-edit-container'>
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
