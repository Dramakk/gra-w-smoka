import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Loading from '../helpers/Loading'
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
  const [isLoading, updateIsLoading] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    updateIsLoading(true)

    async function getCategories () {
      const fetchResult = await fetch('/categories.json', { signal: abortController.signal })
        .then(res => res.json())
        .catch(err => {
          console.log(err)
          history.push('/404')
        })
      setCategories(fetchResult)
      updateIsLoading(false)
    }

    getCategories()

    return () => {
      abortController.abort()
      updateIsLoading(false)
    }
  }, [categories.length])

  return (
    <div className='level-select-container'>
      {
        isLoading
          ? <Loading />
          : <div className='level-select'>
              {
                categories.filter(category => category.categoryLevels.length > 0).map((category, index) => {
                  return (
                    <Category key={index} category={category}/>
                  )
                })
              }
            </div>
      }
      <div className='level-select-buttons'>
        <button onClick={() => history.push('/levels/import')}>Użyj poziomu z edytora</button>
        <button onClick={() => history.push('/')}>Wróć do głównego menu</button>
      </div>
    </div>
  )
}
