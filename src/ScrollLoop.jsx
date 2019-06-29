import React, {useEffect, useReducer} from 'react';
import normalizeWheel from 'normalize-wheel';
import './ScrollLoop.css'

const ScrollLoop = () => {

    const initialState = {offSetY: 0};
    const reducer = (state, action) => {
        switch (action.type) {
            case 'translateY':
                const { pixelY } = action.payload;

                return {offSetY: state.offSetY + pixelY};
            default:
                throw new Error();
        } 
    }
    const [state, dispatch] = useReducer(reducer, initialState)

    const handleWheelInput = (event) => {
        const wheel = normalizeWheel(event); 
        dispatch({type: 'translateY', payload: wheel})
    }

    useEffect( ()=> {
        document.addEventListener('mousewheel', function (event) {
            handleWheelInput(event)
        });
    },[])

    const cssTranlsate = {
        transform: `translate3d(0px, ${state.offSetY}px, 0px)`,
    }

    return (
        <div className="scroll-container">
            <div style={cssTranlsate} className="row scroll-item">
                <p className="one-of-three title">Item 1</p>
                <div className="one-of-three">
                    <p>Tranlsate-Y:</p>
                    <p>{state.offSetY}px</p>
                </div>
            </div>
        </div>
    )

}

export default ScrollLoop