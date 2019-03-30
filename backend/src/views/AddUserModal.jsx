import { view } from "react-easy-state";
import React from 'react'

class AddUserModal extends React.Component {


    render() {
        return false
    }
}

export default view(AddUserModal);

// export default view(() => {

//     return (
//         <div className="modal fade show" id="addUserModal" aria-modal="true">
//             <div className="modal-dialog modal-dialog-centered" role="document">
//                 <div className="requests">
//                     <div className="title">
//                         <h1>Create User</h1>
//                         <button type="button" className="btn" data-dismiss="modal" aria-label="Close"><i className="material-icons">close</i></button>
//                     </div>
//                     <div className="content">
//                         <form action="#">
//                             <div className="form-group">
//                                 <label htmlFor="name">Full Name:</label>
//                                 <input type="text" className="form-control" id="name" placeholder="John Doe" required></input>
//                             </div>
//                             <div className="form-group">
//                                 <label htmlFor="username">Username:</label>
//                                 <input type="text" className="form-control" id="username" placeholder="Enter username..." required></input>
//                             </div>
//                             <div className="form-group">
//                                 <label htmlFor="password">Password:</label>
//                                 <input type="password" className="form-control" id="password" placeholder="Enter username..." required></input>
//                             </div>
//                             <div className="form-check">
//                                 <input type="checkbox" className="form-check-input" id="admin"></input>
//                                 <label className="form-check-label" htmlFor="admin">Admin</label>
//                             </div>
//                             <button type="submit" className="btn button w-100">Create User</button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>

//     )
// });