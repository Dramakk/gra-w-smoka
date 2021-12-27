import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { resetDragon } from '../../engine/engine'
import { parseLevel } from '../../levels/levelParser'
import Modal, { ButtonDescription } from '../helpers/Modal'
import { CategoryDescription, CategoryLevelDescription } from './LevelSelect'

interface CategoryProps {
  category: CategoryDescription
}

export default function Category (props: CategoryProps): React.ReactElement {
  const history = useHistory()
  const [opened, changeOpened] = useState(false)
  const [selectedLevel, changeSelectedLevel] = useState(null as CategoryLevelDescription)
  const [modalOpen, changeModalOpen] = useState(false)
  const [isLoading, changeIsLoading] = useState(false)
  const modalButtons: ButtonDescription[] = [
    {
      buttonText: 'Zamknij',
      buttonType: isLoading ? 'disabled' : 'primary',
      onClick: () => onModalClose()
    },
    {
      buttonText: 'Zagraj',
      buttonType: isLoading ? 'disabled' : 'success',
      onClick: () => onModalPlay()
    }
  ]

  function onModalPlay (): void {
    if (!selectedLevel) {
      return
    }

    changeIsLoading(true)

    fetch(`/${selectedLevel.levelFileName}`)
      .then(async res => {
        const parsedResponse = await res.json()
        try {
          const level = parseLevel(parsedResponse)
          const game = resetDragon({ level, dragon: null, shouldInteract: true })
          history.push('/game', {
            editor: null,
            game
          })
        } catch (e) {
          console.log(e)
          changeIsLoading(false)
        }
      })
      .catch(err => {
        console.log(err)
        changeIsLoading(false)
      })
  }

  function onModalClose (): void {
    changeModalOpen(false)
    setTimeout(() => changeSelectedLevel(null), 500)
  }

  function selectLevel (level: CategoryLevelDescription): void {
    changeSelectedLevel(level)
    changeModalOpen(true)
  }

  return (
    <>
      <div className='category-container'>
        <button className='category-button' onClick={() => changeOpened(!opened)}>
          <div className='category-name'>
            {props.category.categoryName}
          </div>
          <div className='material-icons category-fold'>
            { opened ? 'expand_less' : 'expand_more' }
          </div>
        </button>
        <CSSTransition
          in={opened}
          classNames='slide-down'
          mountOnEnter={true}
          unmountOnExit={true}
          timeout={500}
        >
          <div className="slide-down category-level">
            {
              props.category.categoryLevels.map((level, index) => {
                return (
                  <button key={index} onClick={() => selectLevel(level)}>{level.displayName}</button>
                )
              })
            }
          </div>
        </CSSTransition>
      </div>
      <Modal show={modalOpen} buttons={modalButtons} title={selectedLevel?.displayName}>
        {
          selectedLevel?.levelDescription
            ? <div>{selectedLevel?.levelDescription}</div>
            : <div>Ten poziom nie posiada dodatkowego opisu.</div>
        }
      </Modal>
    </>
  )
}
