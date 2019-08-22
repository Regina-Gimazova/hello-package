import React, {useState, useEffect} from 'react';
import RoomList from '../../components/RoomList';
import './StartPage.css';
import Api from "../../service/api";

const StartPage = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  const loadCustomerList = () => {
    Api.getPendingCallsList()
      .then(data => {
        setCustomers(data.rooms)
      })
      .catch(error => {
        console.log(error)
      })
  };

  useEffect(() => {
    loadCustomerList()
  }, []);

  return (
    <div className='container'>
      <h2>Connections</h2>
      <RoomList rooms={customers}/>
    </div>
  )
}
;

export default StartPage;
