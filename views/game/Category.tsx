import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Modal, { ButtonDescription } from '../helpers/Modal'
import SlideDown from '../helpers/SlideDown'
import { CategoryDescription, CategoryLevelDescription } from './LevelSelect'

interface CategoryProps {
  category: CategoryDescription
  modalToOpen: string
}

export default function Category (props: CategoryProps): React.ReactElement {
  const history = useHistory()
  const [opened, changeOpened] = useState(false)
  const [selectedLevel, changeSelectedLevel] = useState(null as CategoryLevelDescription)
  const [modalOpen, changeModalOpen] = useState(false)
  const modalButtons: ButtonDescription[] = [
    {
      buttonText: 'Zamknij',
      buttonType: 'primary',
      onClick: () => onModalClose()
    },
    {
      buttonText: 'Zagraj',
      buttonType: 'success',
      onClick: () => onModalPlay()
    }
  ]
  const categoryLevels = props.category.categoryLevels

  function onModalPlay (level?: CategoryLevelDescription): void {
    if (!selectedLevel && !level) {
      return
    }

    const levelToLoad = selectedLevel || level
    const levelToLoadIndex = categoryLevels.findIndex(level => level.levelFileName === levelToLoad.levelFileName)
    const nextLevel = levelToLoadIndex !== -1 && levelToLoadIndex !== categoryLevels.length - 1
      ? `?next=${categoryLevels[levelToLoadIndex + 1].levelFileName.split('.json')[0]}`
      : ''
    history.push(`/game/${levelToLoad.levelFileName.split('.json')[0]}${nextLevel}`)
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

  useEffect(() => {
    if (props.modalToOpen) {
      const levelToOpen = categoryLevels.find(level => level.levelFileName.indexOf(props.modalToOpen) !== -1)
      if (levelToOpen) selectLevel(levelToOpen)
    }
  }, [])

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
            ? <div style={{ whiteSpace: 'pre-line' }}>{selectedLevel?.levelDescription}</div>
            : <div>Ten poziom nie posiada dodatkowego opisu.</div>
        }
      </Modal>
    </>
  )
}
