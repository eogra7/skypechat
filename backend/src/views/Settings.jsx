import React, { FunctionComponent, MouseEvent } from "react";
import { view } from "react-easy-state";
import c from 'js-cookie';
import { withRouter } from 'react-router-dom';
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
import api from "../js/api";

class _ReplyEditor extends React.Component {
    state = { show: false, text: '', ref: undefined };

    // constructor(props) {
    //     super(props)

    // }

    handleOpen() {
        this.setState({ show: true })
    }

    handleClose() {
        this.setState({ show: false })
        // also do other stuff
    }

    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }

    handleSelectReply(reply) {

    }

    async handleTextKeyDown(e) {
        if(e.keyCode == 13) {
            const payload = {
                content: this.state.text
            }
            await api.post('/api/add-reply', payload);
            this.setState({text: ''});
            await chatStore.fetchReplies();
        }
    }

    render() {
        return (
            <Dialog
                open={this.state.show}
                onClose={this.handleClose.bind(this)}
                aria-labelledby="manage-replies-dialog-title"
            >
                <DialogTitle id='manage-replies-dialog-title'>Edit Replies</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="new-reply-text"
                        label="Add a reply"
                        type="text"
                        value={this.state.text}
                        onChange={this.handleTextChange.bind(this)}
                        onKeyDown={this.handleTextKeyDown.bind(this)}
                        fullWidth
                    />
                    <List>
                        {chatStore.replies.map((reply) => {
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
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
const ReplyEditor = view(_ReplyEditor);

const Settings = props => {
    const handleLogout = (e) => {
        c.remove('token', { path: '' });
        window.location.reload();
        e.preventDefault();
    };
    const handleAssign = (e) => {
        props.history.push('/assign');
        e.preventDefault();
    };
    var manageRef = React.createRef();
    const Assign = () => {
        return (<div className="category">
            <a onClick={handleAssign} id="assign" className="title collapsed">
                <i className="material-icons md-30 online">assignment</i>
                <div className="data">
                    <h5>Assign Chats</h5>
                    <p>Assign new chats to users</p>
                </div>
                <i className="material-icons">keyboard_arrow_right</i>
            </a>
        </div>)
    }

    const handleClickManageReplies = (e) => {
        manageRef.current.handleOpen();
    }
    const ManageReplies = () => {
        return (<>
            <div className="category">
                <a onClick={handleClickManageReplies} id="manage-replies" className="title collapsed">
                    <i className="material-icons md-30 online">list</i>
                    <div className="data">
                        <h5>Edit Replies</h5>
                        <p>Add or remove replies</p>
                    </div>
                    <i className="material-icons">keyboard_arrow_right</i>
                </a>
            </div>
            <ReplyEditor ref={manageRef}></ReplyEditor>
        </>)
    }
    return (
        <div id="settings" className="tab-pane fade active show">
            <div className="settings">
                <div className="categories" id="accordionSettings">
                    <h1>Settings</h1>
                    {chatStore.isAdmin && <Assign />}
                    {chatStore.isAdmin && <ManageReplies />}
                    <div className="category">
                        <a onClick={handleLogout} id="logout" className="title collapsed">
                            <i className="material-icons md-30 online"> power_settings_new</i>
                            <div className="data">
                                <h5>Logout</h5>
                                <p>End your session and logout</p>
                            </div>
                            <i className="material-icons">keyboard_arrow_right</i>
                        </a>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default withRouter(view(Settings));
