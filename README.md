# Sync-Meet - Calender meeting project

Sync-Meet is a meeting scheduler that utilizes Google calendar. By synchronizing several users calendars, Sync-Meet finds a timespan where every or the majority of users can attend a meeting. The flow of the program is as follows:

1. A user goes to the homepage of sync-meet and clicks on create new meeting. 

2. The user inputs the following:
  * Meeting title: The name of the meeting.
  * Name: The name that this user will have in the group.
  * Start date: The start date from where the calendar should find a meeting. 
  * End date: The end date to where the calendar should find a meeting.
  * Start time: The earliest time of day the meeting can start.
  * End time: The latest possible time of day a meeting can end.
  * Meeting time: How long the meeting should be in hours and minutes.
 
The user is now the owner of the meeting and gets redirected to the calendar page. The owner can now invite other people to the meeting scheduler by sending them a link. Every user that receives the link will have to accept access to their Google calendar before joining. 

3. As more users join the group, Sync-Meet will update the available meeting time and create events. An event will show the start time, end time, meeting time and a colour. The colour of the event is green if every member of the group is available for the event and yellow if everyone except one can join. There is also a chat for the users in the sidebar of the calendar page. 

4. The owner finds a suitable time for the meeting and Sync-Meet is closed. 

# What has been done
  1. Users can create meetings. 
  2. Users can join other existing meetings. 
  3. Users can leave meetings. If the owner leaves the meeting, the meeting is deleted. 
  4. Google authentication is implemented. If a users token has expired, they will have to authenticate again.
  5. A calendar view which shows possible events for meetings. Green if all can attend and yellow if one person can't attend. 
  6. A sidebar next to calendar is implementend. It contains information about the users, the meeting and a chat. 


# Future plans
  1. Add the possibility to drag the width of the sidebar.
  2. Potentially add support for adding an event to all users calendar.
  3. Make the website mobile friendly. 

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

# How to setup
The program is live at http://sync-meet.osoriobretti.com/ for anyone to use. 

However, if you want to try it locally, complete the following steps:

1. Clone this repository.  
2. Go to root/client. 
3. Run `npm install` to install dependencies. 
4. Run `npm start` to start a local server at port 3000. 
