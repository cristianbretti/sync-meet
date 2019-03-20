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

# Future plans

# Project file structure
