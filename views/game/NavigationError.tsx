import React from 'react'
import { useHistory } from 'react-router-dom'
export default function NavigationError (): React.ReactElement {
  const history = useHistory()

  return (
    <div className="navigation-error">
      <div className="navigation-error-text">
        Coś poszło nie tak...
      </div>
      <button onClick={() => history.push('/')}>Powróć do głównego menu</button>
    </div>
  )
}
