import React, { Component } from 'react';



interface SideBarProps {}

interface SidebarState {
    isOwner: boolean,
    groupName: string,
    fromDate: string,
    toDate: string,
    fromTime: string
    toTime: string,
    meetingTime: 0,
    members: [string]
}



class Sidebar extends Component<SideBarProps, SidebarState> {
    constructor(props: SideBarProps) {
        super(props);
        this.state = {
            isOwner: false,
            groupName: "",
            fromDate: "01/01-2019",
            toDate: "01/01-2019",
            fromTime: '00:00',
            toTime: '00:00',
            meetingTime: 0,
            members: ["Erik, Anton, Cristian, Marko"]
        };
      }



  render() {
    return (
      <div>
        <div className="text-center">
            <h3 className= "py-1 px-1 mx-1 text-center">Group Name</h3>
        </div>
        <div className="py-3 my-3 px-1 mx-1 flex"> {/* This is the fromDate*/}
          <div className="flex-1 text-center">
            <h4>From date</h4>
          </div>
          
          <div className="flex-1 text-center">
            <h4>{this.state.fromDate}</h4>
          </div>
        </div>

        <div className="py-3 my-3 px-1 mx-1 flex"> {/* This is the toDate */}
          <div className="flex-1 text-center">
            <h4>To date</h4>
          </div>
          
          <div className="flex-1 text-center">
            <h4>{this.state.toDate}</h4>
          </div>
        </div>

        <div className="py-3 my-3 px-1 mx-1 flex"> {/* This is the fromTime */}
          <div className="flex-1 text-center">
            <h4>From time</h4>
          </div>
          
          <div className="flex-1 text-center">
            <h4>{this.state.fromTime}</h4>
        
          </div>
        </div>

        <div className="py-3 my-3 px-1 mx-1 flex"> {/* This is the toTime */}
          <div className="flex-1 text-center">
            <h4>To time</h4>
          </div>
          
          <div className="flex-1 text-center">
            <h4>{this.state.toTime}</h4>
        
          </div>
        </div>

        <div className="py-3 my-3 px-1 mx-1 flex border-b border-black"> {/* This is the meeting time */}
          <div className="flex-1 text-center">
            <h4>Meeting time</h4>
          </div>
          
          <div className="flex-1 text-center">
            <h4>{this.state.meetingTime + " min"}</h4>
        
          </div>
        </div>

        <div className="text-center">
            <h3 className= "py-1 px-1 mx-1 text-center">Members</h3>
        </div>
        <div className="text-center">
            <h4 className= "py-1 px-1 mx-1 text-center">Erik</h4>
        </div>
        <div className="text-center">
            <h4 className= "py-1 px-1 mx-1 text-center">Cristian</h4>
        </div>
        <div className="text-center">
            <h4 className= "py-1 px-1 mx-1 text-center">Marko</h4>
        </div>
        <div className="text-center">
            <h4 className= "py-1 px-1 mx-1 text-center">Anton</h4>
        </div>

      </div>
      
    );
  }
}

export default Sidebar;
