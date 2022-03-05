import "./App.css";
import Item from "./components/Item";

function App() {
  const link1 = "https://github.com/dudzpedra/react-aws-app";
  const link2 =
    "https://aws.amazon.com/pt/getting-started/hands-on/deploy-react-app-cicd-amplify/";

  return (
    <div className="App">
      <h1>A simple React and AWS app.</h1>
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

export default App;
