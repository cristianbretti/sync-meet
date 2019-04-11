import React from 'react'
import AnimLogo from '../components/logo/AnimLogo'
import Logo from '../components/logo/Logo'
class Error extends React.Component<any> {
    render() {
        return (<div>
                    <div className="bottom-border">
                        <Logo className="flex flex-col items-center" />  
                    </div>
                    <div>
                        <p className="text-center text-5xl text-grey-darkest font-medium">Error</p>
                    </div>
                    <div>
                        <p className="text-center text-grey text-xl font-normal">Ooops! Something went wrong, please try again.</p>
                    </div>
                   
                </div>)
    }
}

export default Error