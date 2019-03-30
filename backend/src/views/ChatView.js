import React, { useEffect } from "react";
import {
    view
} from "react-easy-state";
import ChatMessage from './ChatMessage';
import { useSpring, animated } from 'react-spring';
import api from "../js/api";
import chatStore from './../js/store';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';



class ReplyPicker extends React.Component {
    state = {show: false, query: '', ref: undefined};

    constructor(props) {
        super(props)

        this.handleClickReply.bind(this);
        this.handleClose.bind(this);
        this.handleQueryChange.bind(this)
    }

    handleClickReply() {
        this.setState({show: true})
    }

    handleClose() {
        this.setState({ show: false })
        // also do other stuff
    }

    handleQueryChange(e) {
        this.setState({ query: e.target.value});
    }

    handleSelectReply(reply) {
        // console.log(reply.content);
        const payload = {
            cid: chatStore.currentChat().cid,
            message: reply.content
        };
        api.post('/api/send-message', payload);
        this.setState({query: ''});
        this.handleClose()
    }

    render() {
        return (
            <Dialog
                open={this.state.show}
                onClose={this.handleClose.bind(this)}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id='form-dialog-title'>Reply</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="search-query"
                        label="Search"
                        type="text"
                        value={this.state.query}
                        onChange={this.handleQueryChange.bind(this)}
                        fullWidth
                    />
                    <List>
                        {chatStore.replies.filter(reply => reply.content.includes(this.state.query)).map((reply) => {
                            return (
                                <ListItem button onClick={this.handleSelectReply.bind(this, reply)} key={reply._id}>
                                    <ListItemText>
                                        {reply.content}
                                    </ListItemText>
                                </ListItem>)
                        })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose.bind(this)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}


function ChatView(props) {
    let messages = props.chat.messages.map((message, i) => {
        return <ChatMessage key={i} message={message} />;
    });

    const ref = React.createRef();
    const textRef = React.createRef();
    const dialogRef = React.createRef();
    useEffect(() => {
        ref.current.scrollIntoView();
    });
    useEffect(() => {
        chatStore.fetchReplies();
    })
    const onSubmitMessage = () => {
        api.post('/api/send-message', {
            cid: props.chat.cid,
            message: textRef.current.value
        })
        textRef.current.value = '';

    }

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            onSubmitMessage();
            e.preventDefault();
        }
    }

    const handleClickReply = () => {
        dialogRef.current.handleClickReply();
    }

    const chatView = <div className="tab-pane active" id={"chat-" + props.chat._id}>
        <div className="chat">
            <div className="top">
                <div className="container">
                    <div className="col-md-12">
                        <div className="inside">
                            <div className="data">
                                {/* eslint-disable-next-line */}
                                <h5><a href="#">{props.chat.topic}</a></h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="container">
                    <div className="col-md-12">
                        <ul className="list-unstyled">
                            {messages}
                            <div ref={ref}></div>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="col-md-12">
                    <div className="bottom">
                        <Button variant="contained" onClick={handleClickReply}>Reply</Button>
                        <ReplyPicker ref={dialogRef}></ReplyPicker>
                    </div>
                </div>
            </div>
        </div>
    </div>
    const mprops = useSpring({ opacity: 1, from: { opacity: 0 } })

    return <animated.div style={mprops}>{chatView}</animated.div>
}

export default view(ChatView);