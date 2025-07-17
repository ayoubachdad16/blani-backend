import React, { useState } from 'react';
import axios from 'axios';

const EditGroup = ({ groupId, token }) => {
  const [name, setName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/groups/${groupId}`,
        {
          name,
          memberEmails: memberEmails.split(',').map(email => email.trim())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage('Groupe mis à jour avec succès ✅');
    } catch (err) {
      if (err.response && err.response.data.message) {
        setMessage(`Erreur : ${err.response.data.message}`);
      } else {
        setMessage("Erreur inconnue.");
      }
    }
  };

  return (
    <div>
      <h2>Modifier un Groupe</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Nouveau nom du groupe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <input
          type="text"
          placeholder="Emails des membres (séparés par virgule)"
          value={memberEmails}
          onChange={(e) => setMemberEmails(e.target.value)}
        /><br /><br />

        <button type="submit">Mettre à jour</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default EditGroup;
