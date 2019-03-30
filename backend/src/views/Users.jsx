import React from "react";
import UserListItem from "./UserListItem";
import $ from 'jquery';
import { view } from "react-easy-state";
import api from '../js/api';
import { Modal, Button } from 'react-bootstrap';

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            show: false,
        };
        this.state = {
            users: []
        };
    }


    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleSubmit() {
        this.handleClose();
        const data = {
            name: this.state.name,
            username: this.state.username,
            password: this.state.password,
            permissions: this.state.permissions
        }
        api.post('/api/createUser', data);
    }

    componentDidMount() {
        api.get('/api/list-users')
            .then(function (response) { return response.json(); })
            .then((data) => {
                this.setState(data);
            });
    }
    componentDidUpdate() {
        $('#contacts i').click(function (event) {
            const elem = $(this);
            const id = $(elem).parents('[data-id]').data('id');
            fetch('/api/delete-user/id', {
                credentials: 'include',
                method: 'post',
                body: JSON.stringify({
                    id: id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) { return response.json(); })
                .then(data => {
                    if (!data.success) {
                        console.log(data);
                    }
                });
        });
    }
    render() {
        const handleChangeName = (e) => this.setState({name: e.target.value});
        const handleChangeUsername = (e) => this.setState({ username: e.target.value });
        const handleChangePassword = (e) => this.setState({ password: e.target.value });
        const handleChangePerms = (e) => this.setState({ permissions: e.target.value ? 'admin' : 'user' });
        return (<div id="users" className="tab-pane fade show active">
            <div className="search">
                <form className="form-inline position-relative">
                    <input type="search" id="users-search" className="form-control" placeholder="Search for users..."></input>
                    <button type="button" className="btn btn-link loop"><i className="material-icons">search</i></button>
                </form>

                <Button className="btn create" onClick={this.handleShow}>
                    <i className="material-icons">person_add</i>
                </Button>
                <div className="modal fade show active">
                    <div className="modal-dialog modal-dialog-centered">
                        <Modal show={this.state.show} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Create User</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form action="#">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name:</label>
                                        <input type="text" className="form-control" id="name" placeholder="John Doe" onChange={handleChangeName} required></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="username">Username:</label>
                                        <input type="text" className="form-control" id="username" placeholder="Enter username..." onChange={handleChangeUsername} required></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password:</label>
                                        <input type="password" className="form-control" id="password" placeholder="Enter username..." onChange={handleChangePassword} required></input>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="admin" onChange={handleChangePerms} ></input>
                                        <label className="form-check-label" htmlFor="admin">Admin</label>
                                    </div>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={this.handleSubmit} type="submit" className="btn button w-100">Create User</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
            <div className="contacts">
                <h1>Users</h1>
                {this.state.users.map((user) => {
                    return <UserListItem key={user._id} user={user} />;
                })}
            </div>
        </div>)
    }
}


export default view(Users);