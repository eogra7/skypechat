import React from 'react';
import { view } from "react-easy-state";
import ChatListItem from './ChatListItem';
import chatStore from '../js/store';

class Chats extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            chats: chatStore.chats
        };
        chatStore.fetchChats();

    }

    componentDidMount() {
        chatStore.fetchChats();
    }


    render() {

        let items = chatStore.chats.map((chat, i) => {
            // console.log(chat);
            return <ChatListItem key={i} chat={chat} />
        });
        return (
            <div id="discussions" className="tab-pane fade active show" >
                <div className="search">
                    <form className="form-inline position-relative">
                        <input type="search" id="conversations" className="form-control" placeholder="Search for conversations..."></input>
                        <button type="button" className="btn btn-link loop"><i className="material-icons">search</i></button>
                    </form>
                </div>
                <div className="discussions">
                    <h1>Chats</h1>
                    <div className="list-group" id="chats" role="tablist">
                        {items}
                    </div>
                </div>
            </div>
        );
    }
}

export default view(Chats);