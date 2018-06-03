import React, { Component } from 'react'
import {subscribeToDrawings} from "./Api";

//Класс, представляющий список рисунков
class DrawingList extends Component {
    state = {
        //Массив рисунков
        drawings: []
    }
    componentDidMount() {
        //Когда приходит новый рисунок...
        subscribeToDrawings(drawing => {
            //...добавить его в массив рисунков
            this.setState({
                drawings: [...this.state.drawings, drawing]
            })
        })
    }
    //Вывести список рисунков
    render() {
        //При клике рисунок записывается в стейт главного компонента
        return (
            <ul className="DrawingList">
                {this.state.drawings && this.state.drawings.map(drawing => (
                    <li
                        className="DrawingList-item"
                        key={drawing.id}
                        onClick={() => this.props.select(drawing)}
                    >
                        {drawing.name}
                    </li>
                ))}
            </ul>
        )
    }
}

export default DrawingList
