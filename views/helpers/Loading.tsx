import React, { useEffect, useState } from 'react'

export default function Loading (): React.ReactElement {
  const [dots, updateDots] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      if (dots.length === 3) updateDots('.')
      else updateDots(dots + '.')
    }, 500)

    return () => clearInterval(interval)
  })

  return (
    <div className="loading">
      {`Trwa ładowanie${dots}`}
    </div>
  )
}
