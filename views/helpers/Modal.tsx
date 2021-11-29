import React, { useEffect, useState } from 'react'

interface ModalProps {
  onClose: (event: boolean) => void
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

  function closeModal () {
    props.onClose(false)
  }

  return (
  <div className={`modal-background ${show ? 'modal-visible' : ''}`}>
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-text">
          <h2>{title}</h2>
          {props.children}
        </div>
        <div className="modal-buttons">
          <button onClick={closeModal} className="modal-button-close">
            Zamknij
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}
