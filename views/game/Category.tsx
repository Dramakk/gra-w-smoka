import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { resetDragon } from '../../engine/engine'
import { parseLevel } from '../../levels/levelParser'
import Modal, { ButtonDescription } from '../helpers/Modal'
import SlideDown from '../helpers/SlideDown'
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

  function onModalPlay (level?: CategoryLevelDescription): void {
    if (!selectedLevel && !level) {
      return
    }

    const levelToLoad = selectedLevel || level

    changeIsLoading(true)

    fetch(`/${levelToLoad.levelFileName}`)
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
    if (!level.levelDescription) {
      onModalPlay(level)
    } else {
      changeSelectedLevel(level)
      changeModalOpen(true)
    }
  }

  return (
    <>
      <div className='category-container'>
        <button className='category-button' onClick={() => changeOpened(!opened)}>
          <div className='category-name'>
            {props.category.categoryName}
          </div>
          <div className={`material-icons category-fold ${opened ? 'opened' : ''}`}>
            expand_more
          </div>
        </button>
        <SlideDown opened={opened}>
          <div className="category-level">
            {
              props.category.categoryLevels.map((level, index) => {
                return (
                  <button key={index} onClick={() => selectLevel(level)}>{level.displayName}</button>
                )
              })
            }
          </div>
        </SlideDown>
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
