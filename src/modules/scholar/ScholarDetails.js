import { useLocation } from 'react-router-dom';

function ScholarDetails() {
    const location = useLocation();
    const scholar = location.state.scholar;

    return (
      <>
      <h3>This is your Scholar Details page</h3>
      <p>welcome {scholar.account_details.last_name} </p>
      <p>ID: {scholar.account_details.user_id}</p>
      <p>First Name: {scholar.account_details.first_name}</p>
      <p>Middle Name: {scholar.account_details.middle_name}</p>
      <p>Last Name: {scholar.account_details.last_name}</p>
      <p>Program: {scholar.account_details.program}</p>
      <p>Birth Certificate: {scholar.account_details.birth_certificate}</p>
      <p>TOR: {scholar.account_details.tor}</p>
      <p>Narrative Essay: {scholar.account_details.narrative_essay}</p>
      <p>Recommendation Letter: {scholar.account_details.recommendation_letter}</p>
      </>
    );
  }
  
  export default ScholarDetails;