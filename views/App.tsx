import {
  Switch,
  Route,
  useLocation
} from 'react-router-dom'
import React from 'react'
import MainMenu from './game/MainMenu'
import Game from './game/Game'
import Export from './game/Export'
import NavigationError from './game/NavigationError'
import LevelImport from './game/LevelImport'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import LevelSelect from './game/LevelSelect'

export default function App (): React.ReactElement {
  const location = useLocation()

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        classNames="fade"
        timeout={300}
      >
        <Switch location={location}>
          <Route exact path="/">
            <MainMenu />
          </Route>
          <Route exact path="/game">
            <Game />
          </Route>
          <Route exact path="/game/:id">
            <Game />
          </Route>
          <Route exact path="/levels">
            <LevelSelect />
          </Route>
          <Route exact path="/levels/import">
            <LevelImport />
          </Route>
          <Route exact path="/editor">
            <Game />
          </Route>
          <Route exact path="/editor/export">
            <Export />
          </Route>
          <Route path="*">
            <NavigationError />
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  )
}
