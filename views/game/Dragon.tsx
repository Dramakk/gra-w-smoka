import React, { useState, useEffect } from 'react'

interface DragonProps {
  displayDragon: boolean;
  className: string;
  timeout: number;
}

export default function Dragon (props: DragonProps): React.ReactElement {
  const [padding, setPadding] = useState(0)
  useEffect(() => {
    if (props.displayDragon) {
      const timer = setInterval(() => {
        setPadding((padding + 64) % 192)
      }, props.timeout / 3)

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
