import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

// const GET_GREETING = gql`
//   query games {
//     games {
//       id
//     }
//   }
// `;
// const GET_HELLO = gql`
//   query {
//     hello
//   }
// `;
const CREATE_GAME = gql`
  mutation {
    createGame {
      id
    }
  }
`;

const TriviaGame = () => {
  //   const { data } = useQuery(GET_HELLO, {});
  const history = useHistory();
  const [createGame, { loading, error, data }] = useMutation(CREATE_GAME);
  const [create, setCreate] = useState(false);
  useEffect(() => {
    if (create) {
      createGame();
    }
  }, [create, createGame]);

  useEffect(() => {
    if (!loading && data && !error) {
      console.log(data);
      history.push(`/game/join/${data.createGame.id}`);
    }
  }, [loading, data, error, history]);

  return (
    <div className="content-container">
      <div
        className="content-title-group not-found"
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <h2 className="title">
          Answer multiple-choice quiz questions as quickly and as accurately as
          possible . Your score will be displayed on completion of the game.
        </h2>
        <p style={{ marginBottom: '30px' }}>Create a new game!</p>
        <button
          className="glow-on-hover"
          type="submit"
          onClick={() => {
            setCreate(true);
            // console.log(create);
          }}
        >
          Start the game
        </button>
        <br />
      </div>
    </div>
  );
};

export default TriviaGame;
