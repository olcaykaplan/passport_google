import React from 'react'
import { useDispatch } from 'react-redux';
import {logout} from '../redux/actions/login'
 const LogoutButton = () => {
    const dispatch = useDispatch();
    const userLogout = () => {
        dispatch(logout())
      };
    return (
        <button onClick={userLogout} style={{height:"45px", width:"170px", cursor:"pointer", backgroundColor:"orange", borderColor:"orange"}}>
          <b>Logout</b>
        </button>
    )
}

export default LogoutButton
