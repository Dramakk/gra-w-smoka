import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { CategoryDescription } from './LevelSelect'

interface CategoryProps {
  category: CategoryDescription
}

export default function Category (props: CategoryProps): React.ReactElement {
  const history = useHistory()
  const [opened, changeOpened] = useState(false)

  return (
    <div className='category-container'>
      <button className='category-button' onClick={() => changeOpened(!opened)}>
        <div className='category-name'>
          {props.category.categoryName}
        </div>
        <div className='material-icons category-fold'>
          { opened ? 'expand_less' : 'expand_more' }
        </div>
      </button>
    </div>
  )
}
