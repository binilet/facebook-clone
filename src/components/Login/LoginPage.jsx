import React from 'react';
import './LoginPage.css';
import SignUp from '../SignUp/SignUp';
import { useState } from 'react';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import Toast from '../Toast/Toast';

import { useSelector, useDispatch } from 'react-redux';
import {
  set_user,
} from '../redux/slices/userSlice';

function LoginPage({ _db_ }) {
  const [_user_name_email, set_user_name_email] = useState('');
  const [_password, set_password] = useState('');
  const [_form_validated, set_form_validated] = useState(true);
  const [_error_msg, setErrorMsg] = useState(null);
  const [_toast_type, setToastType] = useState(null);

  const global_state = useSelector((state) => state._current_user.user);

  const dispatch = useDispatch();
  const auth = getAuth();

  const show_sign_up_form = () => {
    const sign_up_form = document.getElementById('sign-up-container');
    sign_up_form.style.display = 'flex';
  };

  const handleLogin = async () => {
    const _password_field = document.getElementById('login_pwd_field_id');
    const _user_name_field = document.getElementById('login_email_field_id');

    if (_user_name_email && _user_name_email.trim().length != 0) {
      if (_password && _password.trim().length != 0) {
        _password_field.style.outline = 'none';

        try {
          setPersistence(auth, browserLocalPersistence).then(() => {

            signInWithEmailAndPassword(auth,
              _user_name_email,
              _password).then((sign_in) => {
                set_user_name_email('');
                set_password('');
                dispatch(set_user({ user: sign_in.user }));
              }).catch((err) => {
                console.log('here')
                console.log(err);
                const errorCode = err.code;
                const errorMessage = err.message;

                setErrorMsg(null);
                setToastType(null);

                setErrorMsg(errorCode);
                setToastType('error');
                console.log('An error occured: ', errorCode, errorMessage);
              })

            // const sign_in = await signInWithEmailAndPassword(
            //   auth,
            //   _user_name_email,
            //   _password
            // );
            // if (sign_in) {
            //   set_user_name_email('');
            //   set_password('');
            //   dispatch(set_user({ user: sign_in.user }));
            // }
          }).catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;

            setErrorMsg(null);
            setToastType(null);

            setErrorMsg(errorCode);
            setToastType('error');
            console.log('An error occured: ', errorCode, errorMessage);
          })

        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;

          setErrorMsg(null);
          setToastType(null);

          setErrorMsg(errorCode);
          setToastType('error');
          console.log('An error occured: ', errorCode, errorMessage);
        }
      } else {
        _password_field.style.outline = '1px solid red';
        _user_name_field.style.outline = 'none';
        set_form_validated(false);
      }
    } else {
      _user_name_field.style.outline = '1px solid red';
      set_form_validated(false);
    }
  };

  return (
    <>
      <div class="login_login-container">
        <div class="login_logo-container">
          <div class="login_left-login">
            <div class="login_logo">facebook</div>
            <div class="login_tag-line">
              <h2>
                Connect with friends and the world around you on Facebook.
              </h2>
            </div>
          </div>
        </div>

        <div class="login_login-form-wrapper">
          <div class="login_right-login">
            <div class="login_login-form-container">
              <div class="login_input-field">
                <input
                  type="text"
                  placeholder="Email Or Phone Number"
                  value={_user_name_email}
                  id="login_email_field_id"
                  onChange={(e) => set_user_name_email(e.target.value)}
                ></input>
              </div>
              <div class="login_input-field">
                <input
                  type="password"
                  placeholder="Password"
                  value={_password}
                  id="login_pwd_field_id"
                  onChange={(e) => set_password(e.target.value)}
                ></input>
              </div>

              <div class="login_login-button">
                <button onClick={handleLogin}>Log In</button>
              </div>
              <div class="login_forget-password-section">
                <a>Forget password?</a>
              </div>
              <div class="login_separator"></div>
              <div class="login_create-account-button">
                <button onClick={show_sign_up_form}>Create new account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {_error_msg && <Toast textToShow={_error_msg} msg_type={_toast_type} />}
      <SignUp _db_={_db_} />
    </>
  );
}
export default LoginPage;
