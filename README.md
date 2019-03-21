# Sync-Meet - Calender meeting project

Sync-Meet is a meeting scheduler that utilizes Google calendar. By synchronizing several users calendars, Sync-Meet finds a timespan where every or the majority of users can attend a meeting. The flow of the program is as follows:

1. A user goes to the homepage of sync-meet and clicks on create new meeting. 

2. The user inputs the following:
  * Group name: The name of the group for the meeting.
  * Name: The name that this user will have in the group.
  * Start date: The start date from where the calendar should find a meeting. 
  * End date: The end date to where the calendar should find a meeting.
  * Start time: The earliest time of day the meeting can start.
  * End time: The latest possible time of day a meeting can end.
  * Meeting time: How long the meeting should be in hours and minutes.
 
The user is now the owner of the group/meeting and gets redirected to the calendar page. The owner can now invite other people to the meeting scheduler by sending them a link. Every user that receives the link will have to accept access to their Google calendar before joining. 

3. As more users join the group, Sync-Meet will update the available meeting time and create events. An event will show the start time, end time, meeting time and a colour. The colour of the event is green if every member of the group is available for the event and blue of the majority is available. 

4. The owner finds a suitable time for the meeting and Sync-Meet is closed. 

# What has been done
  1. Backend server is set up with the basic support of creating an event, finding all empty time intervalls for a user and removing the event afterwards.
  2. O-Auth 2 authentication protocol is set up on the client side for Google authentication.
  3. Support for creating an event within the specified date and time interval on the client side.
  4. Basic layout for the calendar/event page where all possible time slots will be shown.
  5. Socket I/O for notifying the client that another user has joined the event.

# Future plans
  1. Add support for adding another user into an already created event.
  2. Create a separate homepage before a page for event creation.
  3. Display all available time slots in a UI friendly way.
  4. Potentially add support for adding an event to all users calendar.

# Project file structure
The root folder contains three folders; `db`, `client` and `server`.

### db
In this folder, the SQLite file for the database is located. SQLite lets us have a single file containing the entire database

### client
In the client folder we find the files needed for the front-end parts of the project. `package.json` specifies which node packages are needed for this project. The files `tsconfig.json` and `tailwind.js` are config files for Typescript and Tailwind respectively.

The `src` folder contains the actual source code for the front end. The front end is built in React with Typescript for type safety

The `public` folder contains the empty `index.html` file and a `favicon`

### server
In this folder, the different python files needed for our back-end exists. We use _flask_ together with _socket IO_ for our back-end server.

`server.py` sets up a server and creates the all endpoints in the back-end. It uses functions from the `helpers.py` to do some logic, like finding free times, getting the users events, login the user etc.

`socket-io.py` creates the socket events used for when users join and leave and for when groups are deleted and updated.

`model.py` contains the database models for our SQLite database.