import React from 'react';
import { view } from 'react-easy-state';
import { Card, Modal } from 'react-bootstrap';
import { colorFromString } from './../js/util';
import chatStore from './../js/store';
import api from '../js/api';

class Assign extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleChatClick = this.handleChatClick.bind(this);
        this.handleUserClick = this.handleUserClick.bind(this);
        this.state = {
            show: false
        }
    }

    handleClose() {
        this.setState({ show: false });
    }


    handleChatClick(chat) {
        this.setState({ currentChat: chat});
        this.setState({ show: true });
    }

    handleUserClick(user) {
        this.handleClose();
        api.get(`/api/assign/${user._id}/${this.state.currentChat._id}`);
    }

    componentDidMount() {
        chatStore.fetchChats();
        chatStore.fetchUsers();
    }

    render() {

        const ChatItem = view((props) => {
            return (
                <div className="row">
                    <Card className="col-md-2" onClick={this.handleChatClick.bind(this, props.chat)}>
                        <Card.Body className="d-flex flex-row">
                            <svg className="avatar-md">
                                <circle cx="20" cy="20" r="20" fill={'#' + colorFromString(props.chat.topic || ' ')}></circle>
                                <text x="50%" y="50%" textAnchor="middle" fill="white" dy=".3em">{(props.chat.topic || '?').substring(0, 1).toUpperCase()}</text>
                            </svg>
                            <div className="flex-col">
                                <h5 className="text-dark ml-1 mb-0">{props.chat.topic}</h5>
                                {/* <h6>10s ago</h6> */}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )
        })

        const UserItem = view((props) => {
            return (
                <li onClick={this.handleUserClick.bind(this, props.user)} className="list-group-item d-flex align-items-center">
                    <svg data-reactroot="" className="avatar-md">
                        <circle cx="20" cy="20" r="20" fill={'#' + colorFromString(props.user.name || ' ')}></circle>
                        <text x="50%" y="50%" text-anchor="middle" fill="white" dy=".3em">{(props.user.name || ' ').substring(0, 1).toUpperCase()}</text>
                    </svg>
                    <h5 className="text-dark ml-1 mb-0">{props.user.name}</h5>

                </li>
            )
        })

        let chats;
        if (chatStore.chats) {
            chats = chatStore.chats.filter((value) => {
                return value.assignedUsers && (value.assignedUsers.length === 0)
            }).map((chat) => {
                return <ChatItem chat={chat} key={chat._id}></ChatItem>
            })
        }  
        
        let users;
        console.log(chatStore);

        if(chatStore.users) {
            users = chatStore.users.map((user) => {
                return <UserItem user={user} key={user._id} />
            })
        }

        return (
            <div>
                <h2>New Chats</h2>
                <div>
                    {chats}
                </div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Assign Chat</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul className="list-group">
                            {users}
                        </ul>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}


export default view(Assign);