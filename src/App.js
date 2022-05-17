import React, { useEffect, useState } from 'react';
import './style.css';
import LoginPage from './components/Login/LoginPage';
import db from './Configs/firebaseConfig';
import {useDispatch, useSelector} from 'react-redux';
import HomePageContainer from './components/HomePageContainer';
import {
  getAuth,
} from 'firebase/auth';
import { set_user } from './components/redux/slices/userSlice';
import FullPageSpinner from './components/Home/progressBar/FullPageSpinner';

const auth = getAuth();

export default function App() 
{
  const [isPageLoading,setIsPageLoading] = useState(false);

 const dispatch = useDispatch();
  var current_user = useSelector(state => state?._current_user?.user);
  
  useEffect(() => {
    auth.onAuthStateChanged(function(user){
      if(user)
      {
        dispatch(set_user({ user: user}));
        setIsPageLoading(false);
      }else{
        setIsPageLoading(false);
      }
    });
    setIsPageLoading(true);
  },[current_user])
  
  return (
    <div>
      
        {isPageLoading ? 
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><FullPageSpinner /></div>
         :
        current_user ?
          <HomePageContainer _db_={db} />
          :
          <LoginPage _db_={db} />
          
          }
      
    </div>
  );
}
