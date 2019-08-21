import React from 'react';
import {Link} from 'react-router-dom';
import './RoomList.css';

const RoomList = ({rooms}) => {
  return (
    <ul className='room-list'>
      {rooms.map((room) => (
        <li key={room.id}>
          <Link to='/call'>
            <p>
              id: {room.id}
            </p>
            <p>
              name: {room.name}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
};

export default RoomList;
