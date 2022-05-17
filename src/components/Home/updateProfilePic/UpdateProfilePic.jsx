import React from 'react';
import './UpdateProfilePic.css';
import {useState,useRef} from 'react';

import {useSelector,useDispatch} from 'react-redux';
import {set_upload_profile_pic_complete, update_profile_pic} from '../../redux/slices/userSlice';
import {v4 as uuidV4} from 'uuid';
import Spinner from '../progressBar/Spinner';



function UpdateProfilePic(){
    const dispatch = useDispatch();

    const [_file,setFile] = useState(null);
    const user = useSelector(state=>state._current_user.user);
    const is_updating = useSelector(state=>state._current_user.update_profile_loading);
    const update_complete = useSelector(state=>state._current_user.update_profile_pic_complete);
    
   

    const profile_pic = useRef(null);

    const loadFile = (e) => {
        try{
            console.log('load xxxx file started ....');
            var image = document.getElementById("output");
            
            const img_url = URL.createObjectURL(e.target.files[0]);
            console.log(img_url);
            image.src = img_url;
            setFile(e.target.files[0]);
            console.log('is isis');
            console.log(e.target.files[0]);
            dispatch(set_upload_profile_pic_complete(false));
            console.log(update_complete);
        }catch(error){
            console.log(error);
        }
        
    }

    const hideProfilePicModal = () => {
        try{
            profile_pic.current.style.display="none";
        }catch(error)
        {
            console.log('error');
        }
    }
    const update_profile_pic_clicked = () => {
        const file_name = uuidV4() + _file?.name;

        dispatch(update_profile_pic({displayName:user.displayName,_file:_file,file_name:file_name}))
    }

    if(update_complete)
    {
        hideProfilePicModal();
    }

    return (
        <div className='update-profile-pic-container' ref={profile_pic} id='update_profile_pic_container'>
             
            <div className="profile-pic">
                <label className="-label" for="pro-file">
                    <span className="glyphicon glyphicon-camera"></span>
                    <span>Upload Image</span>
                </label>
                <input id="pro-file" type="file" onChange={loadFile} />
                <img src={user.photoURL} id="output" width="200" />
               
                <div className='close-btn' onClick={hideProfilePicModal}>
                
                <span class='closeX'>x</span>

                </div>
                <button className='save-profile-pic' onClick={update_profile_pic_clicked}>Save</button>
                {
                    is_updating && <div className='spinner-container'><Spinner/></div>
                }
                
            </div>
        </div>
    );
}

export default UpdateProfilePic;