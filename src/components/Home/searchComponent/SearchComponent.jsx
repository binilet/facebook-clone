import React from 'react';
import './searchComponent.css';
import {useSelector,useDispatch} from 'react-redux';
import {useState} from 'react';
import { fetchPostsByUser } from '../../redux/slices/postSlice';


function SearchComponent() {
    const _post_authors = useSelector((state) => state._current_user.post_authors);
    const [filteredList,setFilteredList] = useState(null);
    
    const searchAuthors = (e) => {
        console.log(e.target.value);
        if(e.target.value.length > 0)
        {
            setFilteredList(_post_authors?.filter(
                x=>x.fname.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
            ));
                console.log(filteredList);
                console.log('filtered length is: ' + filteredList?.length)
        }else{
            setFilteredList(null);
        }
    }

    return (
        <div class="input-container">
            <div class="input-container-wrapper">
                <i class="fa fa-search"></i>
                <input
                    class="search-facebook-input-field"
                    type="text"
                    placeholder="Search Facebok Authors"
                    onChange={searchAuthors}
                />
            </div>

            {(filteredList && filteredList.length > 0) &&
                <div className='srch-drop-down_container'>
                    {filteredList && filteredList.map((usr) => {
                        console.log('user is ');
                        console.log(usr);
                        return <SearchDropDownComponent usr={usr} key={usr.auth_user_id} />
                    })}
                </div>
            }
        </div>
    );
}

//on list select has its own
function SearchDropDownComponent({usr,key}) {
    const dispatch = useDispatch();

    return (
        <div className='srch-result-container' key={key} onClick={()=>dispatch(fetchPostsByUser(usr?.auth_user_id))}>
            <div className='srch-result-pic'>
                <img src={usr?.photoURL} alt=''/>
            </div>
            <div className="srch-result-name">
                <span>{usr?.fname}</span>
            </div>
        </div>

    );


}
export default SearchComponent;