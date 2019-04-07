from flask_socketio import SocketIO, send, join_room, leave_room, close_room

sio = SocketIO()

""" SOCKET IO """
@sio.on('join')
def on_join(group_str_id):
    join_room(group_str_id)
    send("join", room=group_str_id)


@sio.on('rejoin')
def on_rejoin(group_str_id):
    join_room(group_str_id)


@sio.on('leave')
def on_leave(group_str_id):
    leave_room(group_str_id)
    send("leave", room=group_str_id)


@sio.on('delete')
def on_delete(group_str_id):
    send("delete", room=group_str_id)
    close_room(group_str_id)


@sio.on('update')
def on_update(group_str_id):
    send("update", room=group_str_id)
