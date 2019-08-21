import React from 'react';
import RoomList from '../../components/RoomList';
import './StartPage.css';

const rooms = [
  {id: 1, name: 'John Doe'},
  {id: 2, name: 'Liza Doe'},
  {id: 3, name: 'Mary Doe'}
];

const StartPage = () => {
  return (
    <div className='container'>
      <h2>Connections</h2>
      <RoomList rooms={rooms}/>
    </div>
  )
}
;

export default StartPage;
