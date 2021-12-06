import React from 'react'

interface DragonProps {
  displayDragon: boolean;
}

export default function Dragon (props: DragonProps): React.ReactElement {
  return (
    <>
      { props.displayDragon &&
        <div className='dragon-field'>
          S
        </div>
      }
    </>
  )
}
