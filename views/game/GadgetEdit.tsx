import React, { useContext } from 'react'
import { GadgetOptionKeys, GadgetType } from '../../levels/level'
import { GadgetEditState } from '../../state_manager/reducer'
import Modal, { ButtonDescription } from '../helpers/Modal'
import { DispatchContext } from './Game'
import FieldOptions from '../helpers/FieldOptions'
import ImageDropdown from '../helpers/ImageDropdown'
import { getGadgetDesription } from '../../levels/fields'

export type SelectedOptions = Partial<Record<GadgetOptionKeys, string | number >>

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
  let modalButtons: ButtonDescription[] = [
    {
      buttonText: 'Zamknij',
      buttonType: 'primary',
      onClick: () => dispatch({ type: 'CLOSE_MODAL', payload: { nextAction: { type: 'CLEAR_UI_STATE' }, dispatch } })

    }
  ]
  // We don't allow users to edit placed exits/entrances
  const readOnly = props.state.canEdit && (props.selectedGadget === 'EXIT' || props.selectedGadget === 'ENTRANCE')

  if (Object.keys(props.state.availableOptions).length !== 0) {
    modalButtons.push({
      buttonText: 'Zatwierdź',
      buttonType: 'success',
      onClick: () => {
        dispatch({ type: 'CLOSE_MODAL', payload: { nextAction: { type: 'COMMIT_EDIT' }, dispatch } })
      }
    })
  }

  if (props.state.canEdit) {
    // We want to disable ability to edit entrances and exits on the board
    if (props.selectedGadget === 'ENTRANCE' || props.selectedGadget === 'EXIT') {
      modalButtons = modalButtons.filter(button => button.buttonText !== 'Zatwierdź')
    }

    modalButtons.unshift({
      buttonText: 'Usuń',
      buttonType: 'danger',
      onClick: () => {
        dispatch({ type: 'CLOSE_MODAL', payload: { nextAction: { type: 'DELETE_FIELD', payload: { index: props.state.fieldId } }, dispatch } })
      }
    })
  }
  // Update state to currently selected options.
  function updateSelectedOption (optionKey: string): (option: string) => void {
    return (option: string) => {
      const parsedValue = parseInt(option)
      dispatch({ type: 'SELECT_OPTIONS', payload: { selectedOptions: { ...props.selectedOptions, [optionKey]: isNaN(parsedValue) ? option : parsedValue } } })
    }
  }

  // Generate dropdowns
  const availableOptions = Object.keys(props.state.availableOptions)
  if (availableOptions.length) {
    dropdown = availableOptions.reduce((previousDropdown: React.ReactElement, optionKey: GadgetOptionKeys) => {
      const options = props.state.availableOptions[optionKey]
      const mappedOptions = options.map(option => {
        const mappedOption = { text: option.toString(), image: `/images/${option}.png` }

        if (props.selectedGadget === 'START') {
          switch (option) {
            case 'U':
              mappedOption.image = '/images/ARROWUP.png'
              break
            case 'D':
              mappedOption.image = '/images/ARROWDOWN.png'
              break
            case 'R':
              mappedOption.image = '/images/ARROWRIGHT.png'
              break
            case 'L':
              mappedOption.image = '/images/ARROWLEFT.png'
              break
          }
        }

        return mappedOption
      })

      return (
        <>
          { previousDropdown }
          <ImageDropdown disabled={readOnly} options={mappedOptions} selectCallback={updateSelectedOption(optionKey).bind(this)}/>
        </>
      )
    }, null)
  }

  return (
    <Modal title='Wybierz opcje dla gadżetu' show={props.state.showModal} buttons={modalButtons}>
      <div className='gadget-edit-container'>
        <div className='gadget-edit-description'>
          { getGadgetDesription(props.selectedGadget) }
        </div>
        <div className='gadget-edit-picture'>
        <FieldOptions
          typeOfField={props.selectedGadget}
          attributes={props.selectedOptions}
          isField={false}
        />
        </div>
        <div className='gadget-edit-options'>
          {dropdown || <div className='gadget-edit-options-empty'>Brak opcji dla tego gadżetu</div>}
        </div>
      </div>
    </Modal>
  )
}
