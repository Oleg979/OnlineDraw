import React, { Component } from 'react'
import DrawingForm from "./DrawingForm";
import DrawingList from "./DrawingList";
import Drawing from "./Drawing";

//Главный класс приложения
class App extends Component {
  //Стейт по умолчаению пустой
  state = {}

  //Выбрать рисунок и положить в стейт
  selectDrawing = drawing => this.setState({drawing})

  render() {
    //Если рисунок не выбран, показать меню, иначе сам рисунок
    return (
      <div className="App">
        <div className="App-header">
          <h2>OnlineDraw App</h2>
        </div>
          {!this.state.drawing &&
            <div>
                <DrawingForm/>
                <DrawingList select={drawing => this.selectDrawing(drawing)}/>
            </div>
          }
          {this.state.drawing &&
            <Drawing
                drawing={this.state.drawing}
                key={this.state.drawing.id}
            />
          }
      </div>
    )
  }
}

export default App
