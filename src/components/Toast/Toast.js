import React from 'react';
import {useEffect} from 'react';
import './Toast.css';

const Toast = ({ textToShow, msg_type }) => {
  console.log('error type is----- ' + msg_type);
  useEffect(()=>{
    var x = document.getElementById("snackbar");
    x.className = "show ";
    x.className += msg_type;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 6000);
  });
  return <div id="snackbar">{textToShow}</div>;
};
export default Toast;
