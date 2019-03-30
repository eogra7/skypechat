import React from 'react';
import { view } from "react-easy-state";
import { colorFromString } from '../js/util';
import chatStore from '../js/store';
import Sound from 'react-sound';

class ChatListItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        // this.getLastMessage = this.getLastMessage.bind(this);
        this.state = {
            unread: false
        }
    }

    handleClick() {
        chatStore.currentChatId = this.props.chat._id;
        this.setState({unread: false});
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if((prevProps.chat.messages.length < this.props.chat.messages.length) && (chatStore.currentChatId !== this.props.chat._id)) {
            this.setState({unread: true})
        }
    }

    render() {
        let classes = 'single';
        if(this.state.unread) {
            classes += ' unread';
        }
        const NotifSound = () => {
            console.log('trying to play a sound');
            return (<Sound url='/definite.mp3' playStatus={Sound.status.PLAYING}/>);
        };
        return (
            <div onClick={this.handleClick.bind(this)} className={classes} id="list-chat-list">
                {/* <img className="avatar-md" src="/img/avatars/avatar-female-1.jpg" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Janette"></img> */}
                <svg data-reactroot="" className="avatar-md">
                    <circle cx="20" cy="20" r="20" fill={'#' + colorFromString(this.props.chat.topic || ' ')}/>
                    <text x="50%" y="50%" textAnchor="middle" fill="white"
                          dy=".3em">{(this.props.chat.topic || '?').substring(0, 1).toUpperCase()}</text>
                </svg>
                <div className="data">
                    <h5>{this.props.chat.topic}</h5>
                    <p>{(this.props.chat.messages.length !== 0) && this.props.chat.messages[this.props.chat.messages.length - 1].content}</p>
                    {this.state.unread && <NotifSound></NotifSound>}
                </div>
            </div>
        );
    }
}

export default view(ChatListItem);
