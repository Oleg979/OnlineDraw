import React, {Component} from 'react'
import Canvas from 'simple-react-canvas'
import {publishLine, subscribeToDrawingLines} from "./Api"

//Компонент холста рисунка
class Drawing extends Component {

    //По умолчанию нет ни одной линии
    state = {
        lines: []
    }

    componentDidMount() {
        //Подписаться на получение линий рисунка с данным айди
        subscribeToDrawingLines(this.props.drawing.id, linesEvent => {
            //Когда приходит новая линия
            this.setState({
                //Добавить её в массив линий в стейт
                lines: [...this.state.lines, ...linesEvent.lines]
            })
        })
    }

    //Когда рисуется новая линия, передать её на сервер вместе с айди рисунка
    handleLine = line => {
        publishLine({
            drawingId: this.props.drawing.id,
            line
        })
    }

    //Если рисунок задан, вывести канвас, иначе ничего
    render() {
        return this.props.drawing ? (
            <div className="Drawing">
                <div className="Drawing-title">{this.props.drawing.name}</div>
                <Canvas
                    drawingEnabled={true}
                    onDraw={this.handleLine}
                    lines={this.state.lines}
                />
            </div>
        ) : null
    }
}

export default Drawing
