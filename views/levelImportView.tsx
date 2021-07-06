import React, { ReactElement } from 'react'

// Creates form to import level from JSON string.
export class LevelImportView extends React.Component<{createGameView : (importedLevelString: string) => void}, {importedLevel : string}> {
  constructor (props : {createGameView : (importedLevelString: string) => void}) {
    super(props)
    // For now we keep basic level
    this.state = {
      importedLevel: `{
      "fieldsPerRow": 4,
      "start": {"position": 5, "direction": "R"},
      "fieldsToPlace": [
          {"fieldType": "ARROWLEFT", "howManyAvailable": 1},
          {"fieldType": "ARROWUP", "howManyAvailable": 1},
          {"fieldType": "ARROWRIGHT", "howManyAvailable": 1},
          {"fieldType": "ARROWDOWN", "howManyAvailable": 1}
      ],
      "fields": [
          {"id": 0, "image": "W", "typeOfField": "WALL"},
          {"id": 1, "image": "W", "typeOfField": "WALL"},
          {"id": 2, "image": "W", "typeOfField": "WALL"},
          {"id": 3, "image": "W", "typeOfField": "WALL"},
  
          {"id": 4, "image": "W", "typeOfField": "WALL"},
          {"id": 5, "image": "E", "typeOfField": "START"},
          {"id": 6, "image": "E", "typeOfField": "EMPTY"},
          {"id": 7, "image": "W", "typeOfField": "WALL"},
  
          {"id": 8, "image": "W", "typeOfField": "WALL"},
          {"id": 9, "image": "E", "typeOfField": "EMPTY"},
          {"id": 10, "image": "E", "typeOfField": "EMPTY"},
          {"id": 11, "image": "W", "typeOfField": "WALL"},
  
          {"id": 12, "image": "W", "typeOfField": "WALL"},
          {"id": 13, "image": "W", "typeOfField": "WALL"},
          {"id": 14, "image": "W", "typeOfField": "WALL"},
          {"id": 15, "image": "W", "typeOfField": "WALL"}
      ]
  }`
    }
  }

  onSubmit (event : React.FormEvent<HTMLFormElement>) : void {
    event.preventDefault()
    this.props.createGameView(this.state.importedLevel)
  }

  updateImportedLevel (event : React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ importedLevel: event.target.value })
  }

  render () : ReactElement {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Wpisz poziom</label>
        <textarea name='level' onChange={this.updateImportedLevel.bind(this)} rows={50} cols={50} value={this.state.importedLevel}>
        </textarea>
        <input type="submit" value="Graj"/>
      </form>
    )
  }
}
