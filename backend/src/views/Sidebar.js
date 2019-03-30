import React from "react";
import Chats from './Chats';
import Settings from './Settings';
import Users from './Users';
import { view } from "react-easy-state";

class Sidebar extends React.Component {
    render() {
        return (<div className="sidebar" id="sidebar">
            <div className="container">
                <div className="col-md-12">
                    <div className="tab-content">
                        {this.props.match.url === '/chats' && <Chats chats={this.props.chats} />}
                        {this.props.admin && this.props.match.url === '/users' && <Users />} 
                        {this.props.match.url === '/settings' && <Settings />}
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default view(Sidebar);