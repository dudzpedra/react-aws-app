import "./App.css";
import Item from "./components/Item";

import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';

import { Amplify } from 'aws-amplify';
import config from './aws-exports.js';
Amplify.configure(config);

function App({ user, signOut }) {
  const link1 = "https://github.com/dudzpedra/react-aws-app";
  const link2 =
    "https://aws.amazon.com/pt/getting-started/hands-on/deploy-react-app-cicd-amplify/";

  return (
    <div className="App">
      <h1>A simple React and AWS app.</h1>
      <h2>Hello {user.username}</h2>
      <button onClick={signOut}>Sign Out</button>
      <div>
        <p>
          Github Repo: <Item link={link1} text="React AWS App" />
        </p>
      </div>
      <div>
        <p>
          Learn more: <Item link={link2} text="Deploy React App with AWS" />
        </p>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
