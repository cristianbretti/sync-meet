import React from 'react';
import top from '../../resources/images/top.png';
import bottom from '../../resources/images/bottom.png';
import left from '../../resources/images/left.png';
import right from '../../resources/images/right.png';
import Y from '../../resources/images/Y.png';
import N from '../../resources/images/N.png';
import E from '../../resources/images/E.png';
import E2 from '../../resources/images/E2.png';

interface AnimLogoProps {
    className?: string;
}

const AnimLogo: React.SFC<AnimLogoProps> = ({className}) => {
    return <div className={className + " flex flex-col items-center"}>
        <div className="logo-top"><img src={top} alt="top"/></div>
        <div className="flex justify-center">
            <div><img src={left} alt="left"/></div>
            <div className="logo-letter-containter">
                <div className="flex justify-center">
                    <div className="logo-letter"><img src={Y} alt="Y"/></div>
                    <div className="logo-letter"><img src={N} alt="N"/></div>
                </div>
                <div className="flex justify-center">
                    <div className="logo-letter"><img src={E} alt="E"/></div>
                    <div className="logo-letter"><img src={E2} alt="E2"/></div>
                </div>
            </div>
            <div><img src={right} alt="right"/></div>
        </div>
        <div><img src={bottom} alt="bottom"/></div>
    </div>
}

export default AnimLogo;