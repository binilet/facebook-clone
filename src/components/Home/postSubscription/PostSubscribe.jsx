import React from 'react';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {get_user_list,subscribe_to_user} from '../../redux/slices/subscriptionSlice';
import './PostSubscribe.css';

function PostSubscribe({usr,current_user,Key})
{
    const dispatch = useDispatch();
    const subscribed = useSelector(state=>state._subscriptions.is_subscribed);
    const subscribing = useSelector(state=>state._subscriptions.is_subscribing);
    const subscription_failed = useSelector(state=>state._subscriptions.subscription_failed);
    const _current_user = useSelector((state) => state._current_user.user);

    console.log('key is ' + Key);
    const createSubscription = () => {

        dispatch(subscribe_to_user({user:current_user,subscribed_to:Key}));
    }

    const updateText = () =>{
        //if subscribed remove from list
        if(subscribed)
        {
            return 'Subscribed';
        }
        else if(subscribing){
            return 'Subscribing';
        }
        else if(subscription_failed)
        {
            return 'Subscription Failed';
        }
        else
        {
            return 'Subscribe'
        }
    }

    return (
        <div className='subscription-card' Key={Key}>
            <div className='sub-close-btn'>x</div>
            <div className='sub-profile-pic'>
                <img src={usr?.photoURL}></img>
            </div>
            <div className='sub-card-right'>
                <div className='sub-profile-name'>{`${usr?.fname} ${usr?.lname}`}</div>
                <div><button className='sub-btn' onClick={createSubscription}>       
                Subscribe
                </button></div>
            </div>
        </div>
    );
}


function PostSubscribeContainer()
{
    const dispatch = useDispatch();
    const list_of_subscriptions = useSelector(state=>state._subscriptions.subscription_list);
    const _current_user = useSelector(state=>state._current_user.user);

    useEffect(() => {
        dispatch(get_user_list(_current_user.uid));
    },[]);

    console.log('list of subs is');
        console.log(list_of_subscriptions);

    return(
        
        <div>
            {list_of_subscriptions && list_of_subscriptions.map((subscription) => {
                return <PostSubscribe usr={subscription} current_user={_current_user.uid} Key={subscription.auth_user_id}/>
            })}
        </div>
    )
}

export default PostSubscribeContainer;

