from flask_socketio import SocketIO, send, join_room, leave_room, close_room

sio = SocketIO()

""" SOCKET IO """
@sio.on('connect')
def connect_user():
    print("Connected")

@sio.on('join')
def on_join(group_str_id):
    print("Joined")
    print(group_str_id)
    join_room(group_str_id)
    send("New user joined", room=group_str_id)

@sio.on('leave')
def on_leave(group_str_id):
    print("Left")
    print(group_str_id)
    leave_room(group_str_id)
    send("User left", room=group_str_id)

@sio.on('delete')
def on_delete(group_str_id):
    print("Deleted")
    print(group_str_id)
    send("Group is deleted", room=group_str_id)
    close_room(group_str_id)
