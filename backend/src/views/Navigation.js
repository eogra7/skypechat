import React from "react";
import { view } from "react-easy-state";
import { Link } from 'react-router-dom';
import chatStore from '../js/store';
class Navigation extends React.Component {
    componentDidMount() {
        this.setState(chatStore);
    }
    
    render() {
        const url = this.props.match.url;
        return (<div>
            <div className="navigation">
                <div className="container">
                    <div className="inside">
                        <div className="nav nav-tab menu">
                            <Link to="/chats">
                                <i className={"material-icons " + (url === '/chats' ? 'active' : '')}>chat_bubble_outline</i>
                            </Link>
                            <Link to="/users">
                                {this.props.admin &&
                                    <i className={"material-icons " + (url === '/users' ? 'active' : '')}>account_circle</i>}
                            </Link>
                            <div className="f-grow1"></div>

                            <Link to="/settings">
                                <i className={"material-icons " + (url === '/settings' ? 'active' : '')}>settings</i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default view(Navigation);