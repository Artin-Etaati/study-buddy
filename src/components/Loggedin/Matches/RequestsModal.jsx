import classes from '@/css/Loggedin/Matches.module.css'
import defaultAvatar from '@/assets/default-avatar.png';

const RequestsModal =({requests,approvedRequest,denyRequest,isClose}) => {
    return (   
     <div className={classes.requestsModal}>
    <div className={classes.requestsContent}>
    <h2>Incoming Requests</h2>
    {requests.length == 0 ?( 
        <p>No incoming requests at the moment.</p>
    ) : (
         requests.map((request) => (
        <div className={classes.requestCard} key={request.id}>
            <div className={classes.requestAvatar}>
            <img src={ request.profile_picture_url || defaultAvatar} alt="User Avatar" />
                     </div>
                     <div className={classes.requestInfo}>
                       <div className={classes.requestDetails}>
                         <button className = {classes.requestName}
                          onClick={() => setRequestsProfile(request)}>
                          {request.first_name} {request.last_name} 
                          </button>
                         <p>Major: {request.major}</p>
                       </div>
                       <div className={classes.requestActions}>
                         <button
                           className={classes.approveButton}
                           onClick={() => approvedRequest(request.id)}
                           aria-label="Approve Request"
                         >
                           ✓
                         </button>
                         <button
                           className={classes.denyButton}
                           onClick={() => denyRequest(request.id)}
                           aria-label="Deny Request"
                         >
                           ✕
                         </button>
                       </div>
                     </div>
                   </div>
                 ))
               )}
               <button onClick={() => isClose()}>Close</button>
             </div>
           </div>
)}
export default RequestsModal;