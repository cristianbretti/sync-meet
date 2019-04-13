import Logo from '../components/logo/Logo'
import { RouteComponentProps } from 'react-router'
import React, { Component } from 'react'


class Error extends Component<RouteComponentProps<any>> {
    constructor(props: RouteComponentProps<any>) {
        super(props)
        console.log(this.props.location.state)
    }
    render() {
        return (<div>
                    <div className="bottom-border">
                        <Logo className="flex flex-col items-center" />  
                    </div>
                    <div>
                        <p className="text-center text-5xl text-grey-darkest font-medium">Error: {this.props.location.state.errorMessage}</p>
                    </div>
                    <div>
                        <p className="text-center text-grey text-xl font-normal">Ooops! Something went wrong, please try again.</p>
                    </div>
                   
                </div>)
    }
}

export default Error