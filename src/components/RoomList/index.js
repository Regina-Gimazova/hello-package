import React from 'react';
import {Link} from 'react-router-dom';
import './RoomList.css';

const RoomList = ({rooms}) => {
  const setResourceID = (room) => {
    localStorage.setItem('resourceId', room.name);
    localStorage.setItem('displayName', room.user_name);
  };

  return (
    <ul className='room-list'>
      {rooms.map((room) => (
        <li key={room.id} onClick={() => setResourceID(room)}>
          <Link to='/call' >
            <p>
              id: {room.id}
            </p>
            <p>
              name: {room.user_name}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
};

export default RoomList;
