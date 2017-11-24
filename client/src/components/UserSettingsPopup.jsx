import React from 'react';
import { Button, Grid, Popup } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

const UserSettingsPopup = (props) => (
  <Popup wide trigger={<div className="signup-btn">{props.username}</div>} on='click'>
    <Grid divided columns='equal'>
      <Grid.Column>
        <Popup
          trigger={<Button color='black' content={<Link style={{color: 'white'}} className="saved-btn" to="/SavedEvents">Saved</Link>} fluid />}
          content='Browse Saved Events'
          position='bottom left'
          size='tiny'
          inverted
        />
      </Grid.Column>
      <Grid.Column>
        <Popup
          trigger={<Button color='black' content={<Link style={{color: 'white', marginLeft: '-2px'}} className="settings-btn" to="/Settings">Settings</Link>} fluid />}
          content='Change Settings'
          position='bottom center'
          size='tiny'
          inverted
        />
      </Grid.Column>
      <Grid.Column>
        <Popup
          trigger={<Button color='black' content="Logout" onClick={()=> props.handleLogOut()} fluid />}
          content='Have Fun!'
          position='bottom right'
          size='tiny'
          inverted
        />
      </Grid.Column>
    </Grid>
  </Popup>
);

export default UserSettingsPopup;
