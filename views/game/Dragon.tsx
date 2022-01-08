import React, { useState, useEffect, CSSProperties } from 'react'
import { DragonDirectionHistory, DragonInformation } from '../../engine/dragon'

interface DragonProps {
  displayDragon: boolean;
  dragonDirectionHistory: DragonDirectionHistory;
  isMoving: boolean;
  isStuck: boolean;
  className: string;
  timeout: number;
}

export default function Dragon (props: DragonProps): React.ReactElement {
  const [dragonPadding, setDragonPadding] = useState(0)
  const [starsPadding, setStarsPadding] = useState(0)
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
      let dragonPadding = 0
      const timer = setInterval(() => {
        dragonPadding = (dragonPadding + 64) % 192
        setDragonPadding(dragonPadding)
      }, props.timeout / 3)

      return () => {
        clearInterval(timer)
        setDragonPadding(0)
      }
    }
  }, [props.displayDragon, props.timeout, props.isMoving])

  useEffect(() => {
    if (props.displayDragon && props.isStuck) {
      let starsPadding = 0
      const timer = setInterval(() => {
        starsPadding = (starsPadding + 64) % 128
        setStarsPadding(starsPadding)
      }, props.timeout / 4)
      return () => {
        clearInterval(timer)
        setStarsPadding(0)
      }
    }
  }, [props.displayDragon, props.timeout, props.isMoving])

  const dragonComputedStyles: CSSProperties = {
    backgroundPosition: `${dragonPadding}px`,
    transform: `rotate(${rotation}deg)`,
    transition: `transform ${props.timeout}ms linear`
  }

  const starsComputedStyles: CSSProperties = {
    backgroundPosition: `${starsPadding}px`
  }

  console.log(props.isStuck)

  return (
    <>
      { props.displayDragon &&
        <div className={`dragon-field ${props.className}`}>
          <div className='dragon-image' style={dragonComputedStyles}>
            { props.isStuck &&
              <div className='dragon-stars' style={starsComputedStyles}></div>
            }
          </div>
        </div>
      }
    </>
  )
}
