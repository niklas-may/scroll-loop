import React, {useEffect, useReducer, useRef, createRef} from 'react';
import normalizeWheel from 'normalize-wheel'; 
// More infos on wheel normalization: 
// https://gist.github.com/akella/11574989a9f3cc9e0ad47e401c12ccaf
// https://embed.plnkr.co/plunk/skVoXt
import './ScrollLoop.css'

const ScrollLoop = ( props ) => {
    const { children } = props;

    const copys = 3
    const childrenCopyRef =  useRef([...Array(copys)].map(() => createRef()))
    const childrenCopys = (() => {
        const temp = [];
        for(let copy = 0; copy < copys; copy++) {
            temp.push(
                <div 
                    className={`loop-items items-copy-${copy}`}
                    ref={childrenCopyRef.current[copy]}
                    key={copy}
                >
                {
                    children.map( child => {
                        return child
                    })
                }
            </div>
            );
        }
        return temp
    })()

    const initialState = {
        offSetY: 0,
        childrenHeight: 0
    };
    const reducer = (state, action) => {
        switch (action.type) {
            case 'translateY':
                // Relative share of one copy: 33.3333%
                // Threshold to loop 1.5
                // Offset upper limit = 49.99995%
                // Offset lower limit = 16.6666%
                
                const { pixelY } = action.payload;

                let newOffSetY = pixelY;
                const wheelDirection = (() => {
                    if(pixelY > 0) {
                        return "DOWN"
                    }
                    if(pixelY < 0){
                        return "UP"
                    }
                    if(pixelY === 0){
                        return "UNCHANGED"
                    }      
                })()
                const totalHeight = state.childrenHeight * copys;
                const relativeOffset = state.offSetY / totalHeight * 100 * -1;

                if(wheelDirection === "UP" && relativeOffset > 49.99995) {
                    newOffSetY += state.childrenHeight
                }
                if(wheelDirection === "DOWN" && relativeOffset < 16.6666) {
                    newOffSetY -= state.childrenHeight
                }

                return {...state, offSetY: state.offSetY + newOffSetY};
           
            case 'init':
                const height = childrenCopyRef.current[0].current.clientHeight;
                return {...state, offSetY: -height, childrenHeight: height}
            default:
                throw new Error();
        } 
    }
    const [state, dispatch] = useReducer(reducer, initialState)

    const handleWheelInput = (event) => {
        event.preventDefault();
        const wheel = normalizeWheel(event); 
        dispatch({type: 'translateY', payload: wheel})
    }

    const cssItemsWrapper = {
        transform: `translate3d(0px, ${state.offSetY}px, 0px)`,
    }
    const cssScrollContainer = {
        height: `${state.childrenHeight}px`,
        overflow: "hidden",
    }
    
    useEffect( () => {
        dispatch({type: 'init'})
        
        document.addEventListener('onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll', event => handleWheelInput(event), false);
        return () => {
            document.removeEventListener('onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll', event => handleWheelInput(event), false);
        }
    },[])

    return (
        <div className="scroll-loop-container" style={cssScrollContainer}>
            <div className="items-wrapper" style={cssItemsWrapper}>
                {childrenCopys}
            </div>
        </div>
    )

}

export default ScrollLoop