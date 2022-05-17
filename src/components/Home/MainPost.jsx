import React from 'react';
import './MainPost.css';

import {useSelector,useDispatch} from 'react-redux';
import {update_post_rxn} from '../redux/slices/postSlice';
import {getTime} from '../helpers/timeStampConverter';
import CommentList from './CommentList';
import {useState} from 'react';
import {v4 as uuidV4} from 'uuid';

import {add_comment,get_comment_by_post_id} from '../redux/slices/postSlice';
import {get_content_author} from '../redux/slices/userSlice';


function MainPost({ post,post_author,cmt_count,Key }) {

  const [showMore,setShowMore] = useState(false);

  const current_user = useSelector((state) => state._current_user.user);
  let list_of_comments = useSelector((state) =>state._posts.comments);
  const _content_authors = useSelector((state) => state._current_user.post_authors);

  if(list_of_comments)
  {
    list_of_comments = list_of_comments.filter(comment=>comment.for_post === Key);
  }


  const like_count = post?.post_rxns?.like_count;
  const comment_count = post?.post_rxns?.comment_count;
  const share_count = post?.post_rxns?.share_count;
  const [currentComment,setCurrentComment] = useState('');
 
  const dispatch = useDispatch();

  const like_rxn_btn_cliked = async () => {
    dispatch(update_post_rxn({post_id:Key,type:'like'}));
  };

  const share_rxn_btn_cliked = async () => {
    dispatch(update_post_rxn({post_id:Key,type:'share'}));
  };

  const get_content_author_object = (author_id) => {
    try {
      dispatch(get_content_author(author_id));
    } catch (error) {
      console.log('error fetching post authro object: ' + error);
    }
  }

  const add_new_comment = () => {
      const obj = {
        comment_id:uuidV4(),
        author_name: current_user?.displayName,
        author_id:current_user?.uid,
        for_post: Key,//key is post id
        comment_body: currentComment,
        comment_date: Date.now(),
        like_count:0,
        dislike_count:0
      };

      try{    
        var add_comment_field = document.getElementById(`add_comment_id_${Key}`);
        add_comment_field.innerHTML="";
        add_comment_field.textContent="";
      }
      catch(error)
      {
        console.error(error);
      }
      setCurrentComment('');
      dispatch(add_comment(obj));
      dispatch(update_post_rxn({post_id:Key,type:'comment'}));
      
  }

  const media_section =
    post.media_url && post.media_url.trim().length > 0 ? (
      <div className="media">
        <img class="media-pic" src={post.media_url}></img>
      </div>
    ) : null;
      
  const getComments = () => {

    if (!list_of_comments || list_of_comments.length == 0) {
      dispatch(get_comment_by_post_id(Key));
      console.log('selected post id is: ' + Key);
    }
  }

  return (
    <div class="container" Key={Key}>
      <div class="post">
        <div class="profile">
          <div class="profile-section">
            <div class="profile-img">
              <img
                class="circle-profile-img"
                width="40"
                height="40"
                src={post_author?.photoURL}//this should be post owners profile pic
              ></img>
            </div>
            <div class="profile-name">
              <div class="name">
                <strong>
                  <span class="profile-name">{post_author?.fname}</span>
                </strong>
              </div>
              <div class="post-date">{getTime(post.post_date)}</div>
            </div>
          </div>
          <div class="elipsi-section">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>

        <div class="content">{showMore? post?.post_body : post?.post_body?.substring(0,250)}
          {post?.post_body.length > 250
          && 
          <label 
          className='showMoreLabel'
          onClick={()=> setShowMore(!showMore)}
          style={{color:'blue',fontWeight:'bold',fontSize:'12px'}}>&nbsp;&nbsp; {showMore? 'Show Less' : 'Show More'}</label>}
        </div>

        {media_section}

        {/* <!--start rxn --> */}
        <div class="rxns">
          <div class="like-count">
            <i class="fas fa-thumbs-up"></i>
            <span style={{padding:'6px'}}>{like_count}</span>
          </div>
          <div class="comment-share">
            <div class="comment-count">
              {cmt_count} comments
            </div>
            <div class="share-count">
              {share_count} Shares</div>
          </div>
        </div>
        {/* <!--end rxn --> */}
        <div class="separator"></div>
        {/* <!--rxn btns--> */}
        <div class="rxn-btns">
          <div class="post-rxn-btns">
            <button onClick={like_rxn_btn_cliked}>
              <i className="like-icon-button rxn-icon-button"></i>
              <span>Like</span>
            </button>
          </div>
          <div class="post-rxn-btns">
            <button>
              <i class="comment-icon-button rxn-icon-button"></i>
              <span>Comment</span>
            </button>
          </div>
          <div class="post-rxn-btns">
            <button onClick={share_rxn_btn_cliked}>
              <i class="share-icon-button rxn-icon-button"></i>
              <span>Share</span>
            </button>
          </div>
        </div>
        {/* <!--rxn btns --> */}
        <div class="separator"></div>
        {/* <!--most relevant --> */}
        <div class="most-relvenat-sec">
          <div class="most-relevant">
            Most Relevant
            <i class="fas fa-caret-down"></i>
          </div>
        </div>
        {/* <!--end most relevant --> */}

        {/* <!--add comment --> */}
        <div class="add-comment-section">
          <div class="comment-input-img">
            <img
              class="circle-profile-img"
              width="32"
              height="32"
              src={current_user?.photoURL}
            />
          </div>

          <div class="add-comment-field-wrapper">
            <div class="comment-input-container">
              <form class="add-comment-form">
                <div
                  id= {`add_comment_id_${Key}`}
                  class="add-comment-div-placeholder"
                  contenteditable="true"
                  placeholder="Add a comment..."
                  onInput={(e) => setCurrentComment(e.currentTarget.textContent)}
                ></div>
                {/* <div class="add-comment-btns">
                  <i class="far fa-smile-beam"></i>
                  <i class="fas fa-camera"></i>
                  <i class="fas fa-film"></i>
                </div> */}
                <i className='fa fa-paper-plane add-comment-btn' onClick={add_new_comment}></i>
              </form>
            </div>
          </div>
        </div>
        {/* <!--end add comment --> */}

        {/* <!--comment list--> */}
        <div class="comment-list">

          {
            list_of_comments && list_of_comments.map((cmt) => {
              var cmt_author = null;
              var cmt_author = _content_authors.find(auth => auth.auth_user_id === cmt.author_id);
              if (!cmt_author) {
                get_content_author_object(cmt.author_id);
                cmt_author = _content_authors.find(auth => auth.auth_user_id === cmt.author_id);
              }
              return <CommentList cmt={cmt} cmt_author={cmt_author} Key={cmt.comment_id} />
            })
          }


          {/* <!-- view more --> */}
          <div class="view-more-section">
            <div>
              <label className='showMoreLabel' onClick={getComments}>View More Comments</label>
            </div>
            <div>
              
            </div>
          </div>
          {/* <!-- view more --> */}


        </div>
      </div>
    </div>
  );
}
export default MainPost;
