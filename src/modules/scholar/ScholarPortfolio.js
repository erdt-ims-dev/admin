import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import API from 'services/Api'

function ScholarPortfolio() {
    const location = useLocation();
    const scholar = location.state.scholar;

    const [portfolio, setPortfolio] = useState([]);
    //const { scholarId } = useParams();
    //const { history, show } = this.props;
    
    const fetchPortfolio = async () => {
      API.request('scholar_portfolio/retrieveOneByParameter', { col: 'user_id', value: 1 }, response => {
        if (response && response.data) {
          // Make the second API call to retrieve account details
          setPortfolio(response.data)
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error);
      });
    }
    console.log(portfolio);
    useEffect(() => {
      fetchPortfolio();
    }, []);


    return (
      <>
      <h3>welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
      <p>This is the Scholar Tasks page</p>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>study</th>
            <th>study_name</th>
            <th>study_category</th>
            <th>publish_type</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((portfolio) => (
            <tr key={portfolio.id}>
              <td>{portfolio.user_id}</td>
              <td>{portfolio.study}</td>
              <td>{portfolio.study_name}</td>
              <td>{portfolio.study_category}</td>
              <td>{portfolio.publish_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
    );
  }
  
  export default ScholarPortfolio;