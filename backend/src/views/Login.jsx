import React from 'react';
import { view } from 'react-easy-state';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import api from '../js/api';
import { Redirect, withRouter } from "react-router-dom";
import chatStore from '../js/store';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    render() {
        if(chatStore.isLoggedIn) {
            return <Redirect to={{ pathname: '/' }} />;
        }

        const handleUsername = (e) => {
            this.setState({username: e.target.value});
        }

        const handlePassword = (e) => {
            this.setState({password: e.target.value});
        }
        const click = (e) => {
            e.preventDefault();
            const data = {
                username: this.state.username,
                password: this.state.password
            }
            api.post('/api/login', data).then((r) => {
                console.log(r);
                if(r.ok) {
                    chatStore.isLoggedIn = true;
                    this.props.history.push('/chats')
                } else {
                    alert('Invalid username or password');
                }
            })
        }
        
        return (
            <Container className="container-fluid">
                <Row>
                    <Col className="card col-md-4 offset-md-4 mt-">
                        <Form className="card-body">
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" onChange={handleUsername}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={handlePassword} />
                            </Form.Group>
                            <Button onClick={click} variant="primary" type="submit">
                                Submit
                    </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default withRouter(view(Login));