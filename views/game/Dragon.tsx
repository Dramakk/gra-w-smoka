import React, { useState, useEffect } from 'react'

interface DragonProps {
  displayDragon: boolean;
  isMoving: boolean;
  className: string;
  timeout: number;
}

export default function Dragon (props: DragonProps): React.ReactElement {
  const [padding, setPadding] = useState(0)

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

  return (
    <>
      { props.displayDragon &&
        <div className={`dragon-field ${props.className}`}>
          <div className='dragon-image' style={{ backgroundPosition: `${padding}px` }}></div>
        </div>
      }
    </>
  )
}
