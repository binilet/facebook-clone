import React from 'react';

import Header from './Home/Header';
import Stories from './Home/Stories';
import AddPost from './Home/AddPost';
import AddPostModal from './Home/AddPostModal';
import MainPost from './Home/MainPost';
import { advance_page, fetchPostsByUser, gtData } from './redux/slices/postSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useCallback } from 'react';
import PostSubscribeContainer from './Home/postSubscription/PostSubscribe';
import Spinner from './Home/progressBar/Spinner';
import './HomePageContainer.css';
import FullPageSpinner from './Home/progressBar/FullPageSpinner';

function HomePageContainer({ _db_ }) {

  const posts = useSelector((state) => state._posts.posts);
  const _current_user = useSelector((state) => state._current_user.user);
  const _post_authors = useSelector((state) => state._current_user.post_authors);
  const is_post_loading = useSelector((state) => state._posts.is_post_loading);
  const all_comments = useSelector((state)=>state._posts.comments);
  //const page_counter = useSelector((state)=>state._posts.page_counter);
  const dispatch = useDispatch();

  useEffect(() => {
    preload();
  }, []);

  const preload = async () => {
    try {
      dispatch(gtData(_current_user?.uid));
    } catch (error) {
      console.log(error);
    }
  }

  const showPosts = () => {
    if (is_post_loading) {
      return (<div style={{  }}>
        {/* <Spinner /> */}
        <FullPageSpinner />
      </div>);
    }
    return posts &&
      posts.map((post) => {
        var post_author = null;
        console.log(_post_authors);
        var post_author = _post_authors.find(auth => auth.auth_user_id === post.author);
        let cmt_count = 0;
        try{
          var xg = all_comments.filter(cmt=>cmt.for_post == post.post_id);
          if(xg)
          {
            cmt_count = xg.length;
          }
         
        }catch(error){console.log('comment count error: ' + error)}

        return <MainPost post={post} post_author={post_author} cmt_count = {cmt_count} Key={post.post_id} />;
      })
  }

  let bottomBoundaryRef = useRef(null);

  const scrollObserver = useCallback(
    node => {
      new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            dispatch(advance_page());
          }
        })
      }).observe(node);
    }, [advance_page]
  );

  useEffect(() => {
    if (bottomBoundaryRef.current) {
      scrollObserver(bottomBoundaryRef.current);
    }
  }, [scrollObserver, bottomBoundaryRef]);


  return (
    <>
      <Header />
      <div className='homepage-container'>
        <div className='left-content'>
          <PostSubscribeContainer />
        </div>
        <div className='center-content'>
          <Stories />
          <AddPost />
          <AddPostModal _db_={_db_} />
          {showPosts()}
        </div>
        <div className='right-content'>

        </div>

      </div>
      <div style={{ border: '1px solid red',display:'none' }} ref={bottomBoundaryRef}></div>
    </>
  );
}

export default HomePageContainer;
