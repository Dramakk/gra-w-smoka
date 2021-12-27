import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Category from './Category'

export interface CategoryLevelDescription {
  displayName: string;
  levelDescription?: string;
  levelFileName: string;
}

export interface CategoryDescription {
  categoryName: string;
  categoryLevels: CategoryLevelDescription[];
}

export default function LevelSelect (): React.ReactElement {
  const history = useHistory()
  const [categories, setCategories] = useState([] as CategoryDescription[])

  useEffect(() => {
    const abortController = new AbortController()

    async function getCategories () {
      const fetchResult = await fetch('/categories.json', { signal: abortController.signal })
        .then(res => res.json())
        .catch(err => {
          console.log(err)
          history.push('/404')
        })
      setCategories(fetchResult)
    }

    getCategories()

    return () => {
      abortController.abort()
    }
  }, [categories.length])

  return (
    <div className='level-select-container'>
      <div className='level-select'>
        {
          categories.map((category, index) => {
            if (category.categoryLevels.length === 0) return <></>
            return (
              <Category key={index} category={category}/>
            )
          })
        }
      </div>
      <div className='level-select-buttons'>
        <button onClick={() => history.push('/levels/import')}>Użyj poziomu z edytora</button>
        <button onClick={() => history.push('/')}>Wróć do głównego menu</button>
      </div>
    </div>
  )
}
