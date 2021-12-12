import React from 'react'

interface DragonProps {
  displayDragon: boolean;
  className: string;
}

export default function Dragon (props: DragonProps): React.ReactElement {
  return (
    <>
      { props.displayDragon &&
        <div className={`dragon-field ${props.className}`}>
          S
        </div>
      }
    </>
  )
}
