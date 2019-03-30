import React from "react";
import { view } from "react-easy-state";
import chatStore from '../js/store';


export default view((props) => {
    const me = chatStore.user.name === props.message.from;
    return <li>
        <div className={"message" + (me? ' me' : '')}>
            <div className="text-main">
                <div className="text-group">
                    <div className={"text" + (me? ' me' : '')}>
                        <p>{props.message.content}</p>
                    </div>
                </div>
                {/*<span>09:46 AM</span>*/}
            </div>
        </div>
    </li>
}
    
)
