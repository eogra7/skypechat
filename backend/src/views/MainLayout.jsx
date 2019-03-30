import React from "react";
import { view } from "react-easy-state";
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import ChatView from "./ChatView";
import AddUserModal from "./AddUserModal";
import chatStore from '../js/store';
import api from "../js/api";


class MainLayout extends React.Component {
    componentDidMount() {
        api.get('/api/is-admin')
            .then(function (response) { return response.json(); })
            .then((data) => {
                chatStore.isAdmin = data.admin;
            }).catch((rejection) => {
                console.log(rejection);
            })
        api.get('/api/skype/username').then(async r => {
            if (r.ok) {
                const data = await r.json();
                chatStore.user.name = data.data.username;
            }
        })
    }

    

    render() {

        return (<div className="layout">
            <Navigation admin={chatStore.isAdmin} {...this.props}></Navigation>
            <Sidebar admin={chatStore.isAdmin} chats={chatStore.chats} {...this.props} />
            <AddUserModal />
            <div className="main">
                <div className="tab-content" id="nav-tabContent">
                    {chatStore.currentChat() && <ChatView chat={chatStore.currentChat()} key={chatStore.currentChat._id} />}
                </div>
            </div>
        </div>);
    }
}


export default view(MainLayout);