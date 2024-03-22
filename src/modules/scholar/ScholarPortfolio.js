import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import API from 'services/Api'

function ScholarPortfolio() {
    const location = useLocation();
    const scholar = location.state.scholar;

    const [portfolios, setPortfolios] = useState([]);
    //const { scholarId } = useParams();
    //const { history, show } = this.props;
    const fetchPortfolio = async () => {
      API.request('scholar_portfolio/retrieveMultipleByParameter', { col: 'scholar_id', value: scholar.user_id }, response => {
        if (response && response.data) {
          // Make the second API call to retrieve account details
          setPortfolios(response.data)
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error);
      });
    }
    console.log(portfolios);
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
            <th>#</th>
            <th>id</th>
            <th>study</th>
            <th>study_name</th>
            <th>study_category</th>
            <th>publish_type</th>
          </tr>
        </thead>
        <tbody>
        {Object.values(portfolios).map((portfolio, index) => (
          <tr key={portfolio.id}>
            <td>{index+1}</td>
            <td>{portfolio.scholar_id}</td>
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