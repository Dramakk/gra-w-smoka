import React, { useEffect, useRef } from 'react'

interface SlideDownProps {
  children: React.ReactNode
  opened: boolean
}

export default function SlideDown (props: SlideDownProps): React.ReactElement {
  const slideDownRef = useRef(null)

  function collapseSection (element: HTMLElement) {
    const sectionHeight = element.scrollHeight
    const elementTransition = element.style.transition
    const elementDisplay = element.style.display
    element.style.transition = ''

    requestAnimationFrame(function () {
      element.style.height = sectionHeight + 'px'
      element.style.opacity = '1'
      element.style.transition = elementTransition
      element.style.display = elementDisplay

      requestAnimationFrame(function () {
        element.style.height = 0 + 'px'
        element.style.opacity = '0'
      })
    })
  }

  function expandSection (element: HTMLElement) {
    const sectionHeight = element.scrollHeight
    element.style.opacity = '1'
    element.style.height = sectionHeight + 'px'
  }

  function onTransitionEnd (element: HTMLElement) {
    if (!props.opened) {
      element.style.opacity = null
      element.style.height = null
    }
  }

  function handleClick (element: HTMLElement) {
    if (!props.opened) return collapseSection(element)

    expandSection(element)
  }

  useEffect(() => {
    handleClick(slideDownRef.current)
  }, [props.opened])

  return (
    <div ref={slideDownRef} className={`slide-down ${props.opened ? 'visible' : ''}`} onTransitionEnd={() => onTransitionEnd(slideDownRef.current)}>
      {props.children}
    </div>
  )
}
