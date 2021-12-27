import React, { MouseEventHandler, useEffect } from 'react'

export interface ButtonDescription {
  buttonType: 'danger' | 'primary' | 'success' | 'disabled'
  buttonText: string
  onClick: MouseEventHandler
}

interface ModalProps {
  buttons: ButtonDescription[]
  show: boolean
  title?: string
  children: React.ReactNode
}

export default function Modal (props: ModalProps): React.ReactElement {
  const show = props.show
  const title = props.title || 'Oops!...'

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [show])

  return (
  <div className={`modal-background ${show ? 'modal-visible' : ''}`}>
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-text">
          <h2>{title}</h2>
          {props.children}
        </div>
        <div className="modal-buttons">
          {props.buttons.map((buttonDescription, index) => {
            return (
              <button key={index} className={`button-${buttonDescription.buttonType}`} onClick={buttonDescription.onClick} disabled={buttonDescription.buttonType === 'disabled'}>
                {buttonDescription.buttonText}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  </div>
  )
}
