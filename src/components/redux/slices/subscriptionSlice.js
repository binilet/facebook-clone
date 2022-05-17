import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import {collection,query,where,getDocs,limit,addDoc} from 'firebase/firestore';

import db from "../../../Configs/firebaseConfig";

const initialState = {
    subscription_list : [],
    is_subscribed:false,
    is_subscribing:false,
    subscription_failed:false
}

export const get_all_subscription_for_user = createAsyncThunk(
    'subscription_list/get_all_subscription_for_user',
    async (uid, thunkAPI) => {
        //get subscription by uid
        return null;
    }
);
export const subscribe_to_user = createAsyncThunk(
    'subscription_list/subscribe_to_user',
    async (data, thunkAPI) => {
        try {
            const subdoc = collection(db, 'post_subscription');
            console.log(data);
            await addDoc(subdoc, {
                user:data.user,subscribed_to:data.subscribed_to
            });
        } catch (error) {
            console.log(error);
            thunkAPI.rejectWithValue(error);
        }
        return await new Promise((resolve,reject)=>{
            resolve(data.subscribed_to);
        })
    }
);
export const get_user_list = createAsyncThunk(
    'subscription_list/get_user_list',
    async(uid,thunkAPI) =>
    {
        try{

            console.log('...........users to subscribe to................');


            const subscription_docColl = collection(db,'post_subscription');
            const sub_query = query(subscription_docColl,where('user','==',uid));
            const subs_data = await getDocs(sub_query);
            var already_subs_list = [];

            if(subs_data.empty)
            {
                console.log('subs data is empty');
            }
            subs_data.forEach((data)=>{
                const d = data.data();
                already_subs_list.push(d);
            })
            console.log('already subs list is ');
            console.log(already_subs_list);

            const users_docColl = collection(db,'users');
            const _query = query(users_docColl,where('photoURL','!=',null),limit(5));//order by rating
            const _query_result = await getDocs(_query);
            var listOfUsers = [];
            if(!_query_result.empty)
            {
                _query_result.forEach((dt)=>
                {
                    const data = dt.data();
                    var check_user = already_subs_list.find(x=>x.subscribed_to == data.auth_user_id);
                    if(!check_user)
                    {
                        listOfUsers.push(data);
                    }
                });
            }
            else
            {
                console.log('query result is empty');
            }   
            return listOfUsers.filter(x=>x.auth_user_id != uid);//remove current user from subscription list
        }
        catch(error)
        {
            console.log(error);
            thunkAPI.rejectWithValue(error);
        }
    }
);

const subscriptionSlice = createSlice({
    name:'subscriptionSlice',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(get_user_list.fulfilled,(state,action)=>{
            if(action.payload)
            {
                state.subscription_list = action.payload;
            }
        });
        builder.addCase(get_user_list.rejected,(state,action)=>{
            console.log(action.payload);
        });
        builder.addCase(subscribe_to_user.fulfilled,(state,action)=>{
            state.is_subscribed = true;
            state.is_subscribing = false;
            state.subscription_failed = false;
            const res = state.subscription_list.filter(x=>x.auth_user_id != action.payload);
            state.subscription_list = res;
        });
        builder.addCase(subscribe_to_user.pending,(state,action)=>{
            state.is_subscribed = false;
            state.is_subscribing = true;
            state.subscription_failed = false;
        });
        builder.addCase(subscribe_to_user.rejected,(state,action)=>{
            state.is_subscribed = false;
            state.is_subscribing = false;
            state.subscription_failed = true;
            console.log(action.payload);
        });
    }
});

export default subscriptionSlice.reducer;