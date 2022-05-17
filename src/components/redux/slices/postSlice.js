import { jsonEval } from "@firebase/util";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import db from "../../../Configs/firebaseConfig";

import { get_all_content_authors } from './userSlice';

const initialState = {
  posts: [],
  comments:[],
  user_subscriptions:[],
  loading: false,
  is_post_loading:false,
  page_counter:0,
  is_post_saving:false,
}; //this will hold posts that the user subscribed to and its own posts

export const gtData = createAsyncThunk(
  'posts/gtData',
  async(uid,{rejectWithValue,dispatch})=> {
    try{
      await dispatch(get_subscription_list(uid));
      await dispatch(get_all_content_authors());
      await dispatch(fetchPostsForUser(uid));
      //await dispatch(get_all_comments())
      return true;
    }catch(error)
    {
      console.log('i have no idea what tf is happening here');
      rejectWithValue(error);
    }
  }
);

export const get_subscription_list = createAsyncThunk(
  "posts/get_subscription_list",
  async (current_uid, { rejectWithValue }) => {
    try {

      let list_of_subscriptions = [];//get list of subscriptions for userId
      const subsciption_docCollection = collection(db, 'post_subscription');
      const subscription_query = query(subsciption_docCollection, where('user', '==', current_uid));
      const subscription_snapshot = await getDocs(subscription_query);
      subscription_snapshot.forEach((data) => {
        list_of_subscriptions.push(data.data().subscribed_to);
      });
      list_of_subscriptions.push(current_uid);
      console.log('list_of_subscriptions is');
      console.log(list_of_subscriptions);
      return list_of_subscriptions;

    } catch (error) {
      console.log('error : ' + error);
      rejectWithValue(error);
    }
  }
)

export const fetchPostsByUser = createAsyncThunk(
  'posts/fetchPostsByUser',
  async(args,thunkAPI) => {
    try{

      console.log('selected user is uid is ::::::; ' + args);

      const state = thunkAPI.getState();
      console.log(state._posts);
      console.log('da faq faq');

      const pager = state._posts.page_counter;

      console.log('page counter is : ' + pager);

      // let last = null;
      // if(state._posts.posts != null)
      // {
      //   last = state._posts.posts[state._posts.posts.length - 1];
      //   console.log('last is ' + JSON.stringify(last));
      // }

      const docCollection = collection(db, "posts");
      var _query = query(docCollection,where('author','==',args),orderBy("post_date",'desc'));
      
      // if(pager > 0)
      // {
      //   _query = query(docCollection,where('author','==',args),orderBy("post_date",'desc'),startAfter(last),limit(3));
      // }
      
      const posts_querySnapShot = await getDocs(_query);

      let snap_shot_array = [];
      posts_querySnapShot.forEach((doc) => {
        const snap_shot_data = doc.data();
        snap_shot_data.post_id = doc.id;
        snap_shot_array.push(snap_shot_data);
      });

      return snap_shot_array;
    }
    catch(error)
    {
      thunkAPI.rejectWithValue(error);
    }
    
  }
);
///this is not just for current user id but also for users that this current_user subscribed to
export const fetchPostsForUser = createAsyncThunk(
  "posts/fetchPostsForUser",
  async (args, {rejectWithValue,getState}) => {

   try
   {
    console.log('fetch post for user started....');
    let list_of_subscriptions = [];
    const state = getState();
    list_of_subscriptions = state._posts.user_subscriptions;
    console.log('list of subscriptions is from fettchpostforuser: ');
    console.log(list_of_subscriptions);
    const docCollection = collection(db, "posts");
    const _query = query(docCollection,where('author','in',list_of_subscriptions),orderBy("post_date",'desc'));
    const posts_querySnapShot = await getDocs(_query);

    let snap_shot_array = [];
    posts_querySnapShot.forEach((doc) => {
      const snap_shot_data = doc.data();
      console.log(snap_shot_data);
      snap_shot_data.post_id = doc.id;
      snap_shot_array.push(snap_shot_data);
    });
    console.log('snap shot array is ' + snap_shot_array);
    return snap_shot_array;
   }catch(error){
     console.log(error);
     rejectWithValue(error);
   }
  }
);

export const add_post = createAsyncThunk(
  "posts/add_post",
  async (postObj, {rejectWithValue}) => {
    try{
      const docCollection = collection(db, "posts");
    const data = await addDoc(docCollection, {
      author: postObj.author,
      is_post_active: postObj.is_post_active,
      post_body: postObj.post_body,
      media_url:postObj.media_url,
      post_date: postObj.post_date,
      post_rxns: {
        like_count: 0,
        comment_count: 0,
        share_count: 0,
      },
    }); //returns a doc ref
    const saved_data = await getDoc(data);
    let saved_data_x = saved_data.data();
    saved_data_x.post_id = saved_data.id;
    return saved_data_x;
    }catch(error){
      rejectWithValue(error);
      console.log(error);
    }
  }
);
export const add_comment = createAsyncThunk(
  "posts/add_comment",
  async(commentObj,{rejectWithValue}) => {
    try
    {
      const docCollection = collection(db,"comments");
      const doc = await addDoc(docCollection,commentObj);
      commentObj.comment_document_id = doc.id;
      return commentObj;
    }
    catch(error)
    {
      rejectWithValue(error);
      console.log(error);
    }
  }
);

export const get_all_comments = createAsyncThunk(
  "posts/get_all_comments",
  async (nullvalue,thunkAPI) => {
    try {
      const db_colellection = collection(db, "comments")
      var comments = await getDocs(db_colellection,orderBy("like_count",'desc'));//this will get all comments
      let list_of_comments = [];
      comments.forEach((comment) => {
        const snap_shot_data = comment.data();
        snap_shot_data.comment_document_id = comment.id;//necessary for updated
        list_of_comments.push(snap_shot_data);
      })
      return list_of_comments;
    } catch (error) {
      console.log('get all comments rejected');
      thunkAPI.rejectWithValue(error);
    }
  }
)

export const get_comment_by_post_id = createAsyncThunk(
  'posts/get_comment_by_post_id',
  async (args, thunkAPI) => {
    try {
      const db_coll = collection(db, 'comments');
      const qry = query(db_coll, where('for_post', '==', args), orderBy('like_count', 'desc'));
      const comment_list = await getDocs(qry);
      console.log('fetch comment executed.')

      let snap_shot_array = [];
      comment_list.forEach((doc) => {
        const snap_shot_data = doc.data();
        snap_shot_array.push(snap_shot_data);
      });


      return snap_shot_array;

    } catch (error) {
      console.log(error);
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const update_post_rxn = createAsyncThunk(
  "posts/update_post_rxn",
  async (
    rxn_data,
    { rejectWithValue }
  ) => {
    try {
      const docRef = doc(db, "posts", rxn_data.post_id);
      const getdoc = await getDoc(docRef);

      let update_data = getdoc.data().post_rxns;

      if (rxn_data.type === "like") {
        update_data = { post_rxns: { like_count: update_data.like_count + 1 } };
      } else if (rxn_data.type === "comment") {
        update_data = {
          post_rxns: { comment_count: update_data.comment_count + 1 },
        };
      } else if (rxn_data.type === "share") {
        update_data = {
          post_rxns: { share_count: update_data.share_count + 1 },
        };
      }

      await setDoc(docRef, update_data, { merge: true }); //update document

      const updated_document = await getDoc(docRef); //get updated document
      let me_data = updated_document.data();

      me_data.post_id = rxn_data.post_id;
      return me_data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const update_comment_rxn = createAsyncThunk(
  "posts/update_comment_rxn",
  async (rxnObj, thunkAPI) => {
    try {

      console.log('comment id to update :' + rxnObj.comment.comment_document_id);
      console.log(rxnObj);
      var docRef = doc(db, 'comments', rxnObj.comment.comment_document_id);

      let like_count = rxnObj.comment.like_count;
      let dislike_count = rxnObj.comment.dislike_count;

      if (rxnObj.type === 'like') 
      {
        await setDoc(docRef, {like_count: like_count + 1},{merge:true});
      } 
      else if (rxnObj.type === 'dislike') 
      {
        await setDoc(docRef, {dislike_count: dislike_count + 1},{merge:true});
      }
      else if (rxnObj.type === 'unlike') 
      {
        await setDoc(docRef, {like_count: like_count - 1},{merge:true});
      } 
      else if (rxnObj.type === 'undislike') 
      {
        await setDoc(docRef, {dislike_count: dislike_count - 1},{merge:true});
      }
      
      return {type:rxnObj.type,comment_id:rxnObj.comment.comment_id};
     
    } catch (error) {
      thunkAPI.rejectWithValue(error);
      console.log(error);
    }
  }
);

export const postSlice = createSlice({
  name: "_posts",
  initialState,
  reducers: {
    advance_page: (state,action)=>{
      var val = state.page_counter + 1;
      console.log('page counter is: ' + val);
      console.log('advance_page called');
      return {...state,page_counter:val};
    },
    // set_post_saving: (state,action)=>{
    //   state.is_post_saving = action.payload
    // }
  },
  extraReducers: (builder) => {

    builder.addCase(fetchPostsForUser.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(fetchPostsForUser.rejected,(state,action)=>{
      console.log(action.payload);
    })

    builder.addCase(add_post.fulfilled, (state, action) => {
      if (action.payload) {
        if (state.posts) state.posts.unshift(action.payload); //unshift adds element at the beginning of array
        else state.posts = action.payload;
      } else {
        console.log("add post thunk failed");
      }
      state.is_post_saving = false;
    });

    builder.addCase(add_post.rejected,(state,action)=>{
      console.log("add post action failed");
      console.log(action);
      state.is_post_saving = false;
    });
    builder.addCase(add_post.pending,(state,action)=>{
      state.is_post_saving = true;
    })

    builder.addCase(update_post_rxn.fulfilled, (state, action) => {
      if (action.payload) {
        try {
          // let postIndex = state.posts.findIndex(
          //   (obj) => obj.post_id === action.payload.post_id
          // );
          const post = state.posts.find((p)=> p.post_id === action.payload.post_id);
          if(post)
          {
            post.post_rxns = action.payload.post_rxns;
          }
          //state.posts[postIndex].post_rxns = action.payload.post_rxns;
        } catch (error) {
          console.log(error);
        }
      }
    });

    builder.addCase(update_post_rxn.rejected, (state, action) => {
      console.log("action failed");
      console.log(action);
    });

    builder.addCase(add_comment.fulfilled,(state,action) => {
      state.comments.unshift(action.payload);
    });
    builder.addCase(add_comment.rejected,(state,action)=>{
      console.log(action);
    });
    builder.addCase(get_all_comments.fulfilled,(state,action)=>{
      state.comments = action.payload;
    });
    builder.addCase(get_all_comments.rejected,(state,action)=>{
      console.log(action);
    })
    builder.addCase(update_comment_rxn.fulfilled,(state,action)=>{
      const comment = state.comments.find(com => com.comment_id === action.payload.comment_id);
        if(comment)
        {
          if(action.payload.type === 'like')
            comment.like_count = comment.like_count + 1;
          if(action.payload.type === 'unlike')
            comment.like_count = comment.like_count - 1;
          if(action.payload.type === 'dislike')
            comment.dislike_count = comment.dislike_count + 1;
          if(action.payload.type === 'undislike')
            comment.dislike_count = comment.dislike_count - 1;
        }
    });
    builder.addCase(update_comment_rxn.rejected,(state,action)=>{
      console.log(action);
    });
    builder.addCase(get_subscription_list.fulfilled,(state,action)=>{
      state.user_subscriptions = action.payload;
    });
    builder.addCase(get_subscription_list.rejected,(state,action)=>{
      console.log(action.payload);
    });
    builder.addCase(gtData.fulfilled,(state,action)=>{
      state.loading = action.payload;
      state.is_post_loading = false;
    });
    builder.addCase(gtData.pending,(state,action)=>{
      state.is_post_loading = true;
    });
    builder.addCase(fetchPostsByUser.fulfilled,(state,action)=>{
      console.log('fetchPostsByUser fetchPostsByUser fetchPostsByUserfetchPostsByUserfetchPostsByUser ' + state.page_counter)
      //state.posts = action.payload;
      
      // if(state.page_counter == 2)
      // {
      //   console.log('clearing previous state....')
      //   state.posts = [];
      //   console.log('state length is: ' + state.posts.length);
      // }
       

      state.is_post_loading = false;
      //state.posts=state.posts.concat(action.payload);
      state.posts = action.payload;
    });
    builder.addCase(fetchPostsByUser.pending,(state,action)=>{
      state.is_post_loading = true;
    });
    builder.addCase(fetchPostsByUser.rejected,(state,action)=>{
      console.log('******fetch post by user error thrown ****');
      console.log(action.payload);
    });
    builder.addCase(get_comment_by_post_id.fulfilled,(state,action)=>{
      console.log(action.payload);
      if(action.payload && action.payload.length > 0)
        state.comments = state.comments.concat(action.payload);
      console.log(state.comments);
    });
    builder.addCase(get_comment_by_post_id.rejected,(state,action)=>{
      console.log('rejected comment fetch');
      console.log(action.payload);
    })
  },
});

//extra reducers are exported by default so you'll use the name defined
export const {increment_comment_like_count,advance_page} = postSlice.actions;
export default postSlice.reducer;
