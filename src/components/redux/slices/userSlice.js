import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import {collection,query,where,getDocs, setDoc,doc} from 'firebase/firestore';
import {
  getAuth,
  updateProfile,
} from 'firebase/auth';

const auth = getAuth();

import {getStorage,ref,uploadBytes,getDownloadURL} from 'firebase/storage';

import db from "../../../Configs/firebaseConfig";

const initialState = {
  is_authenticated: false,
  user: null,
  post_authors: [],
  update_profile_loading:false,
  update_profile_pic_complete:false,
};



export const get_all_content_authors = createAsyncThunk(
  'user/get_all_content_authors',
  async (args,{rejectWithValue,getState}) => {
    try{
      console.log('get_all_content_authors started');
      const state = getState();
      let list_of_authors = [];
      list_of_authors = state._posts.user_subscriptions;

      console.log('list_of_subscriptions from user is');
      await console.log(state._posts.user_subscriptions);
      console.log('***end***list_of_subscriptions from user is');
      const usr_collection = collection(db,'users');
      const qry = query(usr_collection,where('auth_user_id','in',list_of_authors));
      const usr_snapshot = await getDocs(qry);
      var post_authors = [];
      if(!usr_snapshot.empty)
      {
        usr_snapshot.forEach((usr)=>{
          post_authors.push(usr.data());
        })
      }else{
        console.log('list is empty.....');
      }
      console.log(post_authors);
      return post_authors;
    }catch(error){
      console.log('error : ' + error);
      rejectWithValue(error);
    }
  }
)
export const get_content_author = createAsyncThunk(
  'user/get_content_author',
  async (author_id, thunkAPI) => {
    try {
      const _query = query(collection(db, 'users'), where("auth_user_id", "==", author_id));
      const snap_shot = await getDocs(_query);
      var auth = null;
      snap_shot.forEach((user) => { auth = user.data(); });
      return auth;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
)

export const update_profile_pic = createAsyncThunk(
  'user/update_profile_pic',
  async (udpate_object, thunkAPI) => {
    try {
      const storage = getStorage();
      const upload_path = `profile-pics/${udpate_object.file_name}`;
      const storageRef = ref(storage, upload_path);

      var _url = null;
      console.log(udpate_object._file);
      console.log(udpate_object.displayName);

      const up_profile_pic = await uploadBytes(storageRef, udpate_object._file);
      if(up_profile_pic)
      {
        const _url_ = await getDownloadURL(ref(storage, upload_path));
        try{await updateProfile(auth.currentUser, {//update auth profile
          displayName: udpate_object.displayName,
          photoURL: _url_
        });}catch(error)
        {
          console.log(error);
        }
        //update user object profile pic
        //get user by uid
        
        try {
          const _query = query(collection(db, 'users'), where("auth_user_id", "==", auth.currentUser.uid));
          const snap_shot = await getDocs(_query);
          // const update_prof = await setDoc(snap_shot[0].ref,{photoURL:_url_},{merge:true});
          var ukn = null;
          snap_shot.forEach((user) => {
            ukn = user;
          });
          const update_prof = await setDoc(ukn.ref, { photoURL: _url_ }, { merge: true });
          console.log('erroros is: ' + ukn.ref);
        } catch (error) {
          console.log('erroros is: ' + error);
          console.log(error);
        }
        
        console.log('update profile is: ' + _url_);
        if(_url_)
        {
          return await new Promise((resolve, reject) => {
            resolve(_url_)
          })
        }
      }else{
        console.error('error uploadgin');
      }
      
    } catch (error) {
      console.log(error);
      thunkAPI.rejectWithValue(error);
    }
  });

export const userSlice = createSlice({
  name: '_current_user',
  initialState,
  reducers: {
    set_user:(state,action)=>
    {
      console.log(action.payload);
      return {...state,user:action.payload.user}
    },
    set_user_from_storage:(state,action)=>//when it is from cache/localstorage payload data is different than actual login
    {
      state.user = action.payload;
    },
    set_upload_profile_pic_complete:(state,action)=>{
     try{
      state.update_profile_pic_complete = action.payload;
      console.log('tx tx wals tx: ' + state.update_profile_pic_complete);
     }catch(error)
     {
       console.log(error);
       console.log('tx tx wals tx: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   ' + action.payload);
     }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(get_content_author.fulfilled,(state,action) => {
      if(action.payload)
      {
        console.log(state.post_authors);
        state.post_authors.push(action.payload);
      }
      
    });
    builder.addCase(get_content_author.rejected,(state,action)=>{
      console.log(action.payload);
    });
    builder.addCase(get_all_content_authors.fulfilled,(state,action)=>{
        state.post_authors = action.payload;
    });
    builder.addCase(get_all_content_authors.rejected,(state,action)=>{
      console.log(action.payload);
    });
    builder.addCase(update_profile_pic.fulfilled,(state,action)=>{
      //string value payload.action
      console.log('returned value from change profile pic is -----------' + action.payload);
      //state.user.photoURL = action.payload
      state.user ={...state.user,photoURL:action.payload};
      var post_auths = state.post_authors.find(x=>x.auth_user_id == state.user.uid);
      if(post_auths)
      {
        post_auths.photoURL = action.payload;
      }
      state.update_profile_loading = false;
      state.update_profile_pic_complete =true;
    });
    builder.addCase(update_profile_pic.pending,(state,action)=>{
      //set loading variable = true;
      console.log('is loading ...');
      state.update_profile_loading = true;
      state.update_profile_pic_complete =false;
    });
    builder.addCase(update_profile_pic.rejected,(state,action)=>{
      console.log(action.payload);
      state.update_profile_loading = false;
      state.update_profile_pic_complete =true;
    });
  }
});

export const { validate_user, sign_in_user, sign_up_user,set_user,set_user_from_storage,set_upload_profile_pic_complete } = userSlice.actions;
export default userSlice.reducer;
