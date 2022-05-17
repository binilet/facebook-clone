import React from 'react';
import './SignUp.css';
import { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { collection, setDoc, doc, addDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { set_user } from '../redux/slices/userSlice';
import Toast from '../Toast/Toast';
import Spinner from '../Home/progressBar/Spinner';
import { subscribe_to_user } from '../redux/slices/subscriptionSlice';



function SignUp({ _db_ }) {

  const _DEFAULT_PHOTO_URL = 'https://firebasestorage.googleapis.com/v0/b/facebook-553b4.appspot.com/o/default-profile-img%2Fdefault_profile.jpg?alt=media&token=84a15bf2-9175-45f7-b684-925f6471223e';
  const [_fname, set_fname] = useState('');
  const [_lname, set_lname] = useState('');
  const [_user_name_email, set_user_name_email] = useState('');
  const [_password, set_password] = useState('');
  const [_day, set_day] = useState('');
  const [_month, set_month] = useState('');
  const [_year, set_year] = useState('');
  const [_gender, set_gender] = useState('');

  const [_error_msg, setErrorMsg] = useState(null);
  const [_toast_type, setToastType] = useState(null);

  const [_form_validated, setFormValidated] = useState(true);
  const [_isLoading,setIsLoading] = useState(false);


  const dispatch = useDispatch();
  const auth = getAuth();

  const close_sign_up_form = () => {
    const sign_up_form = document.getElementById('sign-up-container');
    sign_up_form.style.display = 'none';
  };

  const validate_inputs = () => {
    if (!_user_name_email || _user_name_email.trim().length == 0) {
      const mail_field = document.getElementById('sup_email_field');
      mail_field.style.outline = '1px solid red';
      setFormValidated(false);
      return false;
    } else {
      const mail_field = document.getElementById('sup_email_field');
      mail_field.style.outline = '1px solid #ccc';
    }

    if (!_password || _password.trim().length < 5) {
      const pwd_field = document.getElementById('sup_pwd_field');
      pwd_field.style.outline = '1px solid red';
      setFormValidated(false);
      return false;
    } else {
      const pwd_field = document.getElementById('sup_pwd_field');
      pwd_field.style.outline = '1px solid #ccc';
    }

    return true;
  };

  const handle_sign_up = async (e) => {
    try {
      setIsLoading(true);

      e.preventDefault();
      let is_validated = validate_inputs();
      if (!is_validated) {
        return;
      }
      const user_cred = await createUserWithEmailAndPassword(
        auth,
        _user_name_email,
        _password
      );
      if (user_cred) {
        //update profile: set displayname equal to firstname

        updateProfile(auth.currentUser, {
          displayName: _fname,
          photoURL:_DEFAULT_PHOTO_URL
        })
          .then(() => {
            console.log(auth.currentUser);
          })
          .catch((error) => {
            console.log(error);
          });

        //assign user to global user useState
        dispatch(set_user(auth.currentUser));
        //create user object in cloud fire store header
        const payload = {
          auth_user_id: user_cred.user.uid,
          email: _user_name_email,
          fname: _fname,
          lname: _lname,
          gender: _gender,
          dob: Date.now(),
          photoURL:_DEFAULT_PHOTO_URL,
          fullName: _fname + ' ' + _lname,
        };
        //const user_ref = await setDoc(docRef, payload);//set doc is usually for update

        //pass collection name. if it doesn't exists in firestore it will be created
        const collectionRef = collection(_db_, 'users');
        const user_ref = await addDoc(collectionRef, payload);
        if (user_ref) {
          console.log('user object created------' + user_ref.id + ' and uid is: ' + auth.currentUser.uid);
          console.log(user_ref);

          
          dispatch(subscribe_to_user({user:auth.currentUser.uid,subscribed_to:'7ZFaNtyXpKhVsFLqRZAbFOAKVff1'}));
        }
        set_user_name_email('');
        set_password('');
        set_fname('');
        set_lname('');
        set_gender(null);
        set_day('');
        set_month('');
        set_year('');

        setIsLoading(false);
        dispatch(set_user({ user: auth.currentUser }));
      }
      

    } catch (error) {
      setIsLoading(false);
      const error_code = error.code;
      const error_message = error.message;

      setErrorMsg(null);
      setToastType(null);

      setErrorMsg(error_code);
      setToastType('error');

      console.log('Error Occured During Sign Up: ' + error_code, error_message);
      console.log(error);
    }
  };

  return (
    <>
      <div class="sign-up-container" id="sign-up-container">
        <form>
          <div class="sign-up-form-wrapper">
            <div class="sign-up-modal-header">
              <div class="sign-up-header-wrapper">
                <div class="title-wrapper">
                  <div class="sign-up-modal-title">Sign Up</div>
                  <div class="sign-up-modal-tagline">It's quick and easy.</div>
                  {_isLoading && <Spinner/>}
                </div>
              </div>
              <div class="sign-up-close" onClick={close_sign_up_form}>
                <i class="fa fa-times"></i>
              </div>
            </div>
            
            <div class="sign-up-form-detail">
              <div class="name-fields">
                <input
                  class="sign-up-field f_name"
                  type="text"
                  placeholder="First Name"
                  mandatory
                  value={_fname}
                  onChange={(e) => set_fname(e.target.value)}
                ></input>
                <input
                  class="sign-up-field"
                  type="text"
                  placeholder="Last Name"
                  mandatory
                  value={_lname}
                  onChange={(e) => set_lname(e.target.value)}
                ></input>
              </div>
              <div class="signup-mail-password-field">
                <input
                  class="sign-up-field"
                  type="text"
                  placeholder="Mobile number or email"
                  id="sup_email_field"
                  mandatory
                  value={_user_name_email}
                  onChange={(e) => set_user_name_email(e.target.value)}
                ></input>
                <input
                  class="sign-up-field"
                  type="password"
                  placeholder="New Password"
                  mandatory
                  id="sup_pwd_field"
                  value={_password}
                  onChange={(e) => set_password(e.target.value)}
                ></input>
              </div>

              <div class="signup-misc">
                <div class="signup-bday-txt">
                  <span>Birthday</span>
                </div>
                <div class="bday-fields">
                  <div class="sup-select">
                    <select
                      value={_month}
                      onChange={(e) => set_month(e.target.value)}
                    >
                      <option></option>
                      <option>Feb</option>
                      <option>Mar</option>
                    </select>
                  </div>
                  <div class="sup-select">
                    <select
                      value={_day}
                      onChange={(e) => set_day(e.target.value)}
                    >
                      <option></option>
                      <option>15</option>
                      <option>16</option>
                    </select>
                  </div>
                  <div class="sup-select">
                    <select
                      value={_year}
                      onChange={(e) => set_year(e.target.value)}
                    >
                      <option></option>
                      <option>2022</option>
                      <option>1993</option>
                    </select>
                  </div>
                </div>
                <div class="signup-gender-txt">
                  <span>Gender</span>
                </div>
                <div class="gender-fields">
                  <div class="sup_radio">
                    <label for="sup-female">Female</label>
                    <input
                      value="F"
                      onChange={(e) => set_gender(e.target.value)}
                      type="radio"
                      name="sup-gender"
                      id="sup-female"
                    ></input>
                  </div>
                  <div class="sup_radio">
                    <label for="sup-male">Male</label>
                    <input
                      value="M"
                      onChange={(e) => set_gender(e.target.value)}
                      type="radio"
                      name="sup-gender"
                      id="sup-male"
                    ></input>
                  </div>
                  <div class="sup_radio">
                    <label for="sup-other">Custom</label>
                    <input
                      value="O"
                      onChange={(e) => set_gender(e.target.value)}
                      type="radio"
                      id="sup-other"
                      name="sup-gender"
                    ></input>
                  </div>
                </div>
                <div class="sup_terms_and_conditions">
                  <span>
                    By clicking Sign Up, you agree to our <a href="#">Terms</a>,{' '}
                    <a href="#">Data Policy</a> and
                    <a href="#"> Cookies Policy</a>. You may receive SMS
                    Notifications from us and can opt out any time.
                  </span>
                </div>
                <div class="sup_signup-btn">
                  <button onClick={handle_sign_up}>Sign Up</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      {_error_msg && <Toast textToShow={_error_msg} msg_type={_toast_type} />}
    </>
  );
}

export default SignUp;
