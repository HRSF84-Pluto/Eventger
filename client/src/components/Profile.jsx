import React from 'react';
import { Image } from 'semantic-ui-react';

const style = {
  color: 'black'
};

const Profile = (props)=>(
  <div className="profile">
    <div>
      <h1 style={style} className="profileTitle">Welcome{props.username === 'Login'? ' ': ' '+ props.username}</h1>
      <Image src='http://placecorgi.com/250' size='medium' circular />
    </div>
  </div>
);
export default Profile;
