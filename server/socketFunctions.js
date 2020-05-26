module.exports = function (socket, userbaseWithRooms) {
  // In here go all socket related routings

  //  first message to server, user has connected.
  console.log('User connected')

  // id of the newly started socket.
  const _id = socket.id
  let roomGroup;
  let userbase = [];

  // send the user its id
  socket.emit('updateId', _id);

  // newly joined socket joins room according to url (group)
  socket.on('joinRoom', (group) => {
    socket.join(group);
    roomGroup = group;
  })

  // new user has been generated
  socket.on('newUser', (user) => {
    // new user connected.
    // add to room or create room and add to it.
    if (userbaseWithRooms[roomGroup] === undefined) {
      // create room
      userbaseWithRooms[roomGroup] = [user];
    } else {
      // add to room
      userbaseWithRooms[roomGroup].push(user);
    }

    // send new user data to all other clients in group
    socket.broadcast.to(roomGroup).emit('newUser', user);
    // send userbase back to the new user (only sends the new user this)
    socket.emit('List of Users', userbaseWithRooms[roomGroup]);
  })

  // A user is about to disconnect
  socket.on('deletedUser', (user) => {

  })

  // A user on the userbase has changed teams
  socket.on('userbase changes', (user) => {
    // changes where made within userbase. not adding or removing users
    // create temporary variable to store userbase
    let userbase = userbaseWithRooms[roomGroup];
    // find the user who changed and update the userbase
    for (let i = 0; i < userbase.length; i++) {
      if (user.id == userbase[i].id) {
        userbase[i] = user;
      }
    }
    // update the serverside userbase system
    userbaseWithRooms[roomGroup] = userbase;

    // let all group members know so that they may update.
    socket.broadcast.to(roomGroup).emit("List of Users", userbaseWithRooms[roomGroup]);
  })

  // a user has disconnected.
  socket.on('disconnect', () => {
    console.log('user disconnected', _id)

    // make sure the userbase for that room exists
    if (userbaseWithRooms[roomGroup] !== undefined) {
      // remove the disconnected user
      userbaseWithRooms[roomGroup] = userbaseWithRooms[roomGroup].filter((user) => user.id !== _id);

      // tell all group members to erase user from userbase.
      socket.broadcast.to(roomGroup).emit("List of Users", userbaseWithRooms[roomGroup]);
    }
  })
}