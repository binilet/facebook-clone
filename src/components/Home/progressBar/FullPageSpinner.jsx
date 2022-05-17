import React from 'react';
import './FullPageSpinner.css';

function FullPageSpinner(){
    console.log('full page spinnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnner loading');
    return(
        <>
            {/* <div className='test'>
                <div className='dot dot1'></div>
                <div className='dot dot2'></div>
                <div className='dot dot3'></div>
            </div> */}
            <div className='cont'>
                <div className='ring ring1'>
                    <div className='dot dot1'></div>
                </div>
                <div className='ring ring2'>
                    <div className='dot dot2'></div>
                </div>
                <div className='ring ring3'>
                    <div className='dot dot3'></div>
                </div>
                <div className='center'></div>
            </div>
        </>
    );
}
export default FullPageSpinner;