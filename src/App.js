import "./App.css";
import Item from "./components/Item";

import config from "./aws-exports.js";

import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import React, { useState, useEffect } from "react";
import { Amplify, API, Storage } from "aws-amplify";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

const initialFormState = { name: "", description: "" };

Amplify.configure(config);

function App({ user, signOut }) {
  const link1 = "https://github.com/dudzpedra/react-aws-app";
  const link2 =
    "https://aws.amazon.com/pt/getting-started/hands-on/deploy-react-app-cicd-amplify/";

  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const image = await Storage.get(note.image);
          note.image = image;
        }
        return note;
      })
    );
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({
      query: createNoteMutation,
      variables: { input: formData },
    });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }

  return (
    <div className="App">
      <h1>A simple React and AWS app.</h1>
      <h2>Hello {user.username}</h2>
      <button onClick={signOut}>Sign Out</button>
      <div>
        <p>
          Github Repo: <Item link={link1} text="React AWS App" />
        </p>
        <p>
          Learn more: <Item link={link2} text="Deploy React App with AWS" />
        </p>
      </div>
      <div>
        <input
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Note name"
          value={formData.name}
        />
        <input
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Note description"
          value={formData.description}
        />
        <input type="file" onChange={onChange} />
        <button onClick={createNote}>Create Note</button>
        <div style={{ marginBottom: 30 }}>
          {notes.map((note) => (
            <div key={note.id || note.name} className='note'>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              {note.image && <img alt="Note" src={note.image} className='noteImage' />}
              <button onClick={() => deleteNote(note)}>Delete note</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
