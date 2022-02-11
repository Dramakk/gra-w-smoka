import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import SlideDown from '../helpers/SlideDown'
import EditorForm from './EditorForm'

export default function MainMenu (): React.ReactElement {
  const [editorFormDisplay, changeEditorFormDisplay] = useState(false)
  const [infoDisplay, changeInfoDisplay] = useState(false)
  const history = useHistory()

  return (
    <div className="menu">
      <button className="menu-item" onClick={() => history.push('/levels')}>
        <img className="menu-dragon-picture" src="/images/START.png" />
        Wybierz poziom
      </button>
      <button
        className="menu-item"
        onClick={() => changeEditorFormDisplay(!editorFormDisplay)}
      >
        Twórz poziom
      </button>
      <SlideDown opened={editorFormDisplay}>
        <EditorForm />
      </SlideDown>
      <button
        className="menu-item"
        onClick={() => changeInfoDisplay(!infoDisplay)}
      >
        Informacje o aplikacji
      </button>
      <SlideDown opened={infoDisplay}>
        <div>
          „Przygody smoka Bajtazara&quot; to ponowna implementacja „Gry w
          Smoka&quot;. Pierwsza wersja aplikacji została zaprogramowana przez
          Bartosza Doleckiego przy pomocy ActionScript i Adobe Flash Player.
          Była ona dostępna nieodpłatnie na łamach Wrocławskiego Portalu
          Informatycznego do czasu wyłączenia wsparcia dla wtyczki Adobe Flash
          Player.
        </div>
        <br />
        <div>
          Celem gry jest otwarcie wyjścia oraz doprowadzenie do niego smoka. Po
          ukończeniu poziomów dla początkujących, jedyną podpowiedzią dla gracza
          jest nazwa poziomu oraz dostępne gadżety, co dodatkowo podnosi
          trudność łamigłówek.
        </div>
        <br />
        <div>
          Ta wersja aplikacji napisana została przez studentów Wydziału
          Matematyki i Informatyki Uniwersytetu Wrocławskiego, Karolinę
          Jeziorską i Dawida Żywczaka, w ramach pracy dyplomowej.
        </div>
      </SlideDown>
    </div>
  )
}
