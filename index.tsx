import {
  BrowserRouter as Router
} from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'

import './views/sass/main.scss'
import './assets/fonts/MouseMemoirs-Regular.woff2'
import './assets/title.svg'
import App from './views/App'

const domContainer = document.querySelector('#app-container')
// Here we either create game view or editor view. They use the same component, but with different values assigned.
ReactDOM.render(
  <Router>
    <App />
  </Router>, domContainer)
