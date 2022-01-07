import React, { useState, useEffect, CSSProperties } from 'react'
import { DragonDirectionHistory } from '../../engine/dragon'
import { Directions } from '../../levels/level'
import { DragonInformation } from '../../engine/dragon'

interface DragonProps {
  displayDragon: boolean;
  dragonDirectionHistory: DragonDirectionHistory;
  isMoving: boolean;
  className: string;
  timeout: number;
}

export default function Dragon (props: DragonProps): React.ReactElement {
  const [padding, setPadding] = useState(0)
  const [rotation, setRotation] = useState(0)

  // Here we decide how to rotate dragon to match current direction
  useEffect(() => {
    const previous = props.dragonDirectionHistory.previous
    const current = props.dragonDirectionHistory.current
    if (!previous && current) {
      switch (current) {
        case 'D':
          return setRotation(0)
        case 'U':
          return setRotation(180)
        case 'L':
          return setRotation(90)
        case 'R':
          return setRotation(-90)
      }
    }

    if (previous !== current) {
      const currentPossibleValues = DragonInformation.mapDirectionToDeg(current)
      const mappedValues = currentPossibleValues.map(degs => Math.abs(degs - rotation))
      return setRotation(currentPossibleValues[mappedValues.indexOf(Math.min(...mappedValues))])
    }
  }, [props.dragonDirectionHistory.current])

  /*
    Here we are moving background image to "animate" dragon movement
    To prevent stepping in place when interacting with gadget, add shouldInteract
    to isMoving in Game.tsx
  */
  useEffect(() => {
    if (props.displayDragon && props.isMoving) {
      let padding = 0
      const timer = setInterval(() => {
        padding = (padding + 64) % 192
        setPadding(padding)
      }, props.timeout / 3)

      return () => {
        clearInterval(timer)
        setPadding(0)
      }
    }
  }, [props.displayDragon, props.timeout, props.isMoving])

  const computedStyles: CSSProperties = {
    backgroundPosition: `${padding}px`,
    transform: `rotate(${rotation}deg)`,
    transition: `transform ${props.timeout}ms linear`
  }

  return (
    <>
      { props.displayDragon &&
        <div className={`dragon-field ${props.className}`}>
          <div className='dragon-image' style={computedStyles}></div>
        </div>
      }
    </>
  )
}
