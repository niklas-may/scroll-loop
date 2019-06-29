import React from 'react';

const ScrollItem = ( props ) => {
    const { wheel } = props;
    const { pixelY } = wheel;

    const styles = {
        transform: `translate3d(0px, ${pixelY}px, 0px)`
    }

    return (
        <div>
            <p style={styles} >{ pixelY }</p>
        </div>
    )

}

export default ScrollItem