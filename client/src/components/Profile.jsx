import React from 'react';
import { Image } from 'semantic-ui-react';

const Profile = (props)=>(
  <div className="profile">
    <div>
      <Image src='http://placecorgi.com/250' size='medium' circular />
    </div>
  </div>
);
export default Profile;
