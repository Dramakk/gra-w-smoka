import React, { useEffect, useRef, useState } from 'react'

export interface ImageDropdownOption {
  // Used to identify options
  text: string;
  // Optional image to be displayed
  image?: string;
}

export interface ImageDropdownProps {
  options: ImageDropdownOption[]
  selectCallback: (selectedOption: string) => void
  // Determine wheter user can only read selected value
  disabled?: boolean;
}

export default function ImageDropdown (props: ImageDropdownProps): React.ReactElement {
  const mappedOptions = props.options.map(mapOptionToElement)
  const [selectedOption, changeSelectedOption] = useState<string>(props.options[0].text)
  const [isOpen, changeIsOpen] = useState(false)
  const [optionsWidth, changeOptionsWidth] = useState('auto')
  const ref = useRef(null)

  function changeOption (option: string) {
    props.selectCallback(option)
    changeSelectedOption(option)
    changeIsOpen(false)
  }

  function mapOptionToElement (option: ImageDropdownOption, index: number) {
    return (
      <div className="single-option" key={index} onClick={() => changeOption(option.text)}>
        { 'image' in option
          ? <img src={option.image} alt={option.text}/>
          : option.text
        }
      </div>
    )
  }

  function handleOutsideClick (event: MouseEvent) {
    if (ref.current && !ref.current.contains(event.target)) {
      changeIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick, true)
    return () => {
      document.removeEventListener('click', handleOutsideClick, true)
    }
  })

  useEffect(() => {
    if (ref.current) {
      const element = ref.current
      changeOptionsWidth(`${element.offsetWidth}px`)
    }
  })

  return (
    <div ref={ref} className="dropdown-container">
      <div className={`dropdown-selected-option ${props.disabled ? 'disabled' : ''}`} onClick={() => props.disabled ? null : changeIsOpen(!isOpen)}>
        <div style={{ pointerEvents: 'none' }}>
          { mappedOptions[props.options.findIndex(option => option.text === selectedOption)] }
        </div>
        <span className={`material-icons expand ${isOpen ? 'rotate' : ''}`}>expand_more</span>
      </div>
      <div style={{ width: optionsWidth }} className={`dropdown-options ${isOpen ? 'opened' : ''}`}>
        { mappedOptions }
      </div>
    </div>
  )
}
