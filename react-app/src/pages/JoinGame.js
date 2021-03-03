import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

const ADD_PLAYER = gql`
  mutation addPlayerScreen($id: ID!, $name: String!) {
    addPlayerToGame(id: $id, name: $name) {
      id
    }
  }
`;

const JoinGame = () => {
  const history = useHistory();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [addPlayerToGame, { data: addPlayerData }] = useMutation(ADD_PLAYER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      console.log({ id, name });
      addPlayerToGame({ variables: { id, name } });
    }
  }, [loading, id, name, addPlayerToGame]);

  useEffect(() => {
    console.log(addPlayerData, 'addPlayerData');
    if (addPlayerData) {
      console.log(addPlayerData);
      history.push(`/game/play/${id}/${addPlayerData.addPlayerToGame.id}`);
    }
  });

  return (
    <div className="content-container">
      <h2 className="title">Join the game:{id}</h2>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <br />
      <button
        type="button"
        onClick={() => {
          console.log(name, loading);
          setLoading(true);
        }}
        style={{
          color: 'red',
          marginTop: '20px',
        }}
        disabled={!name || loading}
      >
        Join the game
      </button>
    </div>
  );
};

export default JoinGame;
