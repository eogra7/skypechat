import React from 'react';
import { view } from "react-easy-state";
import { colorFromString } from '../js/util';


export default view((props) => (
    <div className="list-group" id="contacts" data-id={props.user._id}>
        {/* eslint-disable-next-line */}
        <a href="#" data-toggle="list" className="contact show">
            {/* <img className="avatar-md" src={props.imageUri || '/img/avatars/avatar-female-1.jpg'} data-toggle="tooltip" data-placement="top" title="" alt="avatar"></img> */}
            <svg data-reactroot="" className="avatar-md">
                <circle cx="20" cy="20" r="20" fill={'#' + colorFromString(props.user.name || ' ')}></circle>
                <text x="50%" y="50%" text-anchor="middle" fill="white" dy=".3em">{(props.user.name || ' ').substring(0, 1).toUpperCase()}</text>
            </svg>
            <div className="data">
                <h5>{props.user.name || 'Loading...'}</h5>
            </div>
            {/* <div className="person-add dropdown">
                <i className="material-icons" data-toggle="dropdown" aria-haspopup="true">more_vert</i>
                <div className="dropdown-menu">
                    <button className="dropdown-item"><i className="material-icons">delete</i>Delete User</button>

                </div>
            </div> */}
            <i className="material-icons">highlight_off</i>


        </a>
    </div>
));
