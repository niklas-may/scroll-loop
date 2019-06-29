import React, {useEffect, useReducer, useRef, createRef} from 'react';
import normalizeWheel from 'normalize-wheel'; 

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
                // When to change the translate, to create the looping effect:
                // The original children are beeing duplicated two times
                // This results in a total of 3 copys of children
                // Relative share of one copy: 33.3333%
                // Threshold to loop below 0.5 and above 1.5
                // Offset upper limit = 49.99995%
                // Offset lower limit = 16.6666%
                
                const pixelY = action.payload;

                let newOffSetY = pixelY * -1;
                const wheelDirection = (() => {
                    if(pixelY < 0) {
                        return "DOWN"
                    }
                    if(pixelY > 0){
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
        const pixelY = wheel.pixelY;

        dispatch({type: 'translateY', payload: pixelY})
    }

    const handleTouchMove = (event) => {
        event.preventDefault();
        console.log(event)
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

        if("ontouchstart" in document) {
            console.log("touch")
            document.addEventListener("touchmove", event => handleTouchMove(event))

        }
        
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