module.exports = function (app, path, __dirname, express) {
  // In here go all routing related things from the server side



  // shorthand for client and server addresses
  const clientAddress = __dirname + '/client/build/';
  const serverAddress = __dirname + '/server';

  // create container for all rooms
  let rooms = ['asdf', '12qw'];

  // front page
  app.get('/', function (req, res) {
    console.log('main');
    res.render('mainPage');
  })

  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '/client/build/')));

  //4 chars that can be letters or numbers captured
  app.get('/[a-zA-Z0-9]{4}$', function (req, res) {
    console.log('roomcode');
    // get roomCode from url
    const roomCode = req.path.substring(1);
    const roomOut = rooms.filter((aRoom) => aRoom.toUpperCase() === roomCode.toUpperCase())
    if (roomOut.length > 0) {
      res.sendFile(path.join(clientAddress + 'index.html'));
    } else {
      res.render('RoomNotFound');
    }
    // does room exist? SQL method
    // client.query('SELECT EXISTS (SELECT * from rooms where roomCode ILIKE $1);', [roomCode], (err, sqlres) => {
    //   // sqlresults gives true or false.
    //   if (sqlres.rows[0].exists) {
    //     // render lobby through express client side
    //     res.sendFile(path.join(clientAddress + 'index.html'));
    //   } else {
    //     // if not render using pug
    //     res.render('RoomNotFound');
    //   }
    // })
  });

  // TODO: post room link
  app.post('/joinRoom', function (req, res) {
    res.redirect('/' + req.body.roomCodeInput);
  })

  // TODO: post create room
  app.post('/', function (req, res) {
    console.log('newRoom');
    let newRoom = '';
    while (newRoom.length !== 4) {
      newRoom = Math.random().toString(36).substring(2, 6);
    }
    rooms.push(newRoom);
    res.redirect('/' + newRoom);
  })

  // if non 4 char link used... send them this.
  app.use(function (req, res) {
    console.log('wronglink');
    res.render('IncorrectLink')
  });
}