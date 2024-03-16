import { useLocation } from 'react-router-dom';

function ScholarLeaveApplication() {
    const location = useLocation();
    const scholar = location.state.scholar;

    return (
      <>
      <p>welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</p>
        <h1>This is your ScholarLeaveApplication page</h1>
      </>
    );
  }
  
  export default ScholarLeaveApplication;