import { BrowserRouter as Router } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'

import './views/sass/main.scss'
import './assets/fonts/MouseMemoirs-Regular.woff2'
import App from './views/App'
declare const BASENAME: any

const domContainer = document.querySelector('#app-container')
// Here we either create game view or editor view. They use the same component, but with different values assigned.
ReactDOM.render(
  <Router basename={BASENAME || undefined}>
    <App />
  </Router>,
  domContainer
)
