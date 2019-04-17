from flask_socketio import SocketIO, send, emit, join_room, leave_room, close_room

sio = SocketIO()

""" SOCKET IO """
@sio.on('join')
def on_join(group_str_id):
    emit('admin', "join", room=group_str_id)
    send('A user has joined', room=group_str_id)
    join_room(group_str_id)


@sio.on('rejoin')
def on_rejoin(group_str_id):
    join_room(group_str_id)


@sio.on('leave')
def on_leave(group_str_id):
    leave_room(group_str_id)
    emit('admin', "leave", room=group_str_id)


@sio.on('delete')
def on_delete(group_str_id):
    emit('admin', "delete", room=group_str_id)
    close_room(group_str_id)


@sio.on('update')
def on_update(group_str_id):
    emit('admin', "update", room=group_str_id)


@sio.on('message')
def on_message(message, group_str_id):
    print(message)
    send(message, room=group_str_id)
