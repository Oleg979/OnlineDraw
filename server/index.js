//Импортируем Socket.io
const io = require('socket.io')()
//Импортируем RethinkDB
const r = require('rethinkdb')


//Функция добавления нового рисунка
const createDrawing = ({connection, name}) => {
    r
        .table('drawings')
        .insert({
            name,
            timestamp: new Date()
        })
        .run(connection)
        .then(() => {
            console.log(`new drawing: ${name}`)
        })
}

//Функция, подписывающая клиента на новые рисунки
const subscribeToDrawings = ({client, connection}) => {
    r
        .table('drawings')
        .changes({include_initial: true})
        .run(connection)
        .then(cursor => {
            cursor.each((err, drawingRow) => {
                //Посылать клиенту каждый новый рисунок
                client.emit('drawing', drawingRow.new_val)
            })
        })
}

//Функция вызывается, когда от клиента приходит информация о новой линии
const handleLinePublish = ({connection, line}) => {
   //Сохранить линию в бд с таймстампом
   r
       .table('lines')
       .insert(Object.assign(line, {timestamp: new Date()} ))
       .run(connection)
}

//Функция, подписывающая клиента на получение новых линий конкретного рисунка
const subscribeToDrawingLines = ({client, connection, drawingId}) => {

   r
       .table('lines')
       .filter(r.row('drawingId').eq(drawingId))
       .changes({include_initial: true})
       .run(connection)
       .then(cursor => {
            cursor.each((err, lineRow) => {
                //Отправить клиенту каждую новую линию
                client.emit(`line:${drawingId}`, lineRow.new_val)
            })
       })
}



//Подключаемся к бд
r.connect({
    host: 'localhost',
    port: 28015,
    db: 'draw'
}).then(connection => {
    console.log("connected to the db")
    //Когда подконнектились, настраиваем сокет
    //Вешаем следующие события:

    //Когда подконнектится новый клиент...
    io.on('connection', client => {

      //Когда клиент создаст новый рисунок...
      client.on('createDrawing', ({name}) => {
          //Положить его в бд
          createDrawing({connection, name})
      })

      //Когда клиент подписывается на новые рисунки
      client.on('subscribeToDrawings', () => {
          //Подписать его
          subscribeToDrawings({client, connection})
      })

      //Когда клиент присылает новую линию
      client.on('publishLine', (line) => {
            //Положить её в бд
            handleLinePublish({connection, line})
      })

      //Когда клиент подписывается на новые линии конкретного рисунка
      client.on('subscribeToLines', drawingId => {
            //Подписать его
            subscribeToDrawingLines({client, connection, drawingId})
      })

    })
})

//Запускаем сокет и вешаем на 8000 порт
const port = 8000
io.listen(port)
console.log(`listening on port ${port}`)
