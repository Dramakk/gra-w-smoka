import React, { useState, useEffect } from 'react'

interface DragonProps {
  displayDragon: boolean;
  className: string;
  timeout: number;
}

export default function Dragon (props: DragonProps): React.ReactElement {
  const [padding, setPadding] = useState(64)
  useEffect(() => {
    if (props.displayDragon) {
      const timer = setInterval(() => {
        setPadding((padding + 64) % 193)
      }, props.timeout / 2)

      return () => {
        clearInterval(timer)
        setPadding(0)
      }
    }
  }, [props.displayDragon, props.timeout])
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
