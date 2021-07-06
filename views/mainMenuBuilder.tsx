import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom'
import { LevelImportView } from './levelImportView'

export class MainMenuView extends React.Component<{createGameView: (importedLevelString: string) => void, createEditorView: (howManyRows: number, howManyPerRow: number) => void}, {howManyRows: number, howManyPerRow: number, editorFormClassDisplay: string}> {
  constructor (props: { createGameView: (importedLevelString: string) => void, createEditorView: () => void }) {
    super(props)
    this.state = { howManyRows: 5, howManyPerRow: 5, editorFormClassDisplay: 'none'}
  }

  renderImportView () : void {
    ReactDOM.render(<LevelImportView createGameView={this.props.createGameView}/>, document.querySelector('#app-container'))
  }

  changeHowManyPerRow (event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ howManyPerRow: Number(event.target.value), howManyRows: this.state.howManyRows })
  }

  changeHowManyRows (event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ howManyRows: Number(event.target.value), howManyPerRow: this.state.howManyPerRow })
  }

  render () : ReactElement {
    return (
        <>
            <div className='menu'>
                <div className='menu-item' onClick={() => this.renderImportView() }>Graj!</div>
                <div className='menu-item' onClick={() => this.setState({ editorFormClassDisplay: 'block' })}>Twórz poziom</div>
                <div style={{display: this.state.editorFormClassDisplay }}>
                  <label htmlFor='howManyRows'>Ile rzędów ma posiadać poziom?</label>
                  <input name='howManyRows' type='number' value={this.state.howManyRows} onChange={this.changeHowManyRows.bind(this)}></input>
                  <label htmlFor='howManyRows'>Ile pól ma posiadać jeden rząd?</label>
                  <input name='howManyPerRow' type='number' value={this.state.howManyPerRow} onChange={this.changeHowManyPerRow.bind(this)}></input>
                  <button onClick={() => this.props.createEditorView(this.state.howManyRows, this.state.howManyPerRow)}>Rozpocznij edycję</button>
                </div>
            </div>
        </>
    )
  }
}
