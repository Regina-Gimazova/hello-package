import React, {useState, useEffect} from 'react';
import RoomList from '../../components/RoomList';
import './StartPage.css';
import Api from "../../service/api";

const StartPage = () => {
  const [customers, setCustomers] = useState([]);

  const loadCustomerList = () => {
    Api.getPendingCallsList()
      .then(list => {
        setCustomers(list)
      })
      .catch(error => {
        //TODO onError
      })
  };

  useEffect(() => {
    loadCustomerList()
  });

  return (
    <div className='container'>
      <h2>Connections</h2>
      <RoomList rooms={customers}/>
    </div>
  )
}
;

export default StartPage;
