import React, { Component } from 'react'
import {createDrawing} from "./Api";

//Компонент формы, добавляющей новый рисунок
class DrawingForm extends Component {
    //По умолчанию имя пустое
    state = {
        name: ''
    }
    //Когда жмем "отправить"...
    handleSubmit = e => {
        //Предотвратить перезагрузку страницы
        e.preventDefault()
        //Отправить сообщение серверу
        createDrawing(this.state.name)
        //Сбросить имя
        this.setState({
            name: ''
        })
    }
    render() {
        return (
            <div className="Form">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input
                        type="text"
                        placeholder="Enter drawing name..."
                        value={this.state.name}
                        onChange={(e) => this.setState({name: e.target.value})}
                        className="Form-drawingInput"
                        required
                    />
                    <button
                        type="submit"
                        className="Form-button"
                    >
                        Create
                    </button>
                </form>
            </div>
        )
    }
}

export default DrawingForm
