import Rx from 'rxjs/Rx'

//Запускаем сокет и вешаем на 8000 порт
import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:8000')

//Функция подписывает клиента на получение новых рисунков
export const subscribeToDrawings = callback => {
    //Когда получили событие drawing с сервера...
    socket.on('drawing', drawing => {
        //...передать его коллбэку, который используется в компоненте
        callback(drawing)
    })
    //Отправляем серверу событие подписки
    socket.emit('subscribeToDrawings')
}

//Функция отправляет на сервер информацию о создании нового рисунка
export const createDrawing = name => {
    socket.emit('createDrawing', {name})
}

//Функция отправляет на сервер событие создания новой линии
export const publishLine = ({drawingId, line}) => {
    socket.emit('publishLine', {drawingId, ...line})
}

//Функция подписывает клиента на получение новых линий конкретного рисунка
export const subscribeToDrawingLines = (drawingId, callback) => {
    //Создаем стрим из событий
    const lineStream = Rx.Observable.fromEventPattern(
        h => socket.on(`line:${drawingId}`, h),
        h => socket.off(`line:${drawingId}`, h),
    )
    //Буферизуем каждые 100 секунд и отправляем линии в компонент
    const bufferedStream = lineStream
        .bufferTime(100)
        .map(lines => ({lines}))
        .subscribe(lines => callback(lines))

    //Отправляем серверу событие подписки
    socket.emit('subscribeToLines', drawingId)
}
