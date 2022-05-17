import React from 'react';
import './Stories.css';
import {useSelector} from 'react-redux';

function Stories() {
  const current_user = useSelector((state)=>state._current_user.user);
  return (
    <div class="stories-container">
      <div class="story-wrapper">
        <div class="story add-story">
          <img
            class="story-img"
            src={current_user?.photoURL}
          />
          <div class="story-owner-profile">
            <div class="profile-img-container">
              <button onclick="shitface()" id="add_story_button">
                <svg viewBox="0 0 20 20" width="1em" height="1em">
                  <g fill-rule="evenodd" transform="translate(-446 -350)">
                    <g fill-rule="nonzero">
                      <path
                        d="M95 201.5h13a1 1 0 1 0 0-2H95a1 1 0 1 0 0 2z"
                        transform="translate(354.5 159.5)"
                      ></path>
                      <path
                        d="M102.5 207v-13a1 1 0 1 0-2 0v13a1 1 0 1 0 2 0z"
                        transform="translate(354.5 159.5)"
                      ></path>
                    </g>
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div class="story-owner-name">
            <span> Create Story</span>
          </div>
        </div>

        <div class="story">
          <img
            class="story-img"
            src="https://images.unsplash.com/photo-1644868731762-e9a9443667a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
          />
          <div class="story-owner-profile">
            <div class="profile-img-container">
              <img src="https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=760,506" />
            </div>
          </div>
          <div class="story-owner-name">
            <span> Jhone Doe</span>
          </div>
        </div>

        <div class="story">
          <img
            class="story-img"
            src="https://images.unsplash.com/photo-1568127861543-b0c0696c735f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
          <div class="story-owner-profile">
            <div class="profile-img-container">
              <img src="https://images.unsplash.com/photo-1552323356-322f06b49db4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=921&q=80" />
            </div>
          </div>
          <div class="story-owner-name">
            <span>Mahitina Manuel</span>
          </div>
        </div>

        <div class="story">
          <img
            class="story-img"
            src="https://media.istockphoto.com/photos/happy-young-woman-in-sports-clothing-smiling-picture-id1297364086"
          />
          <div class="story-owner-profile">
            <div class="profile-img-container">
              <img src="https://images.unsplash.com/photo-1644859698549-895e55624223?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" />
            </div>
          </div>
          <div class="story-owner-name">
            <span> Abebe Kebede</span>
          </div>
        </div>

        <div class="story">
          <img
            class="story-img"
            src="https://images.unsplash.com/photo-1644817488521-cbccb364c629?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80"
          />
          <div class="story-owner-profile">
            <div class="profile-img-container">
              <img src="https://images.unsplash.com/photo-1644859694693-f1c156d1bd67?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" />
            </div>
          </div>
          <div class="story-owner-name">
            <span> Biniyam Teshome</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Stories;
