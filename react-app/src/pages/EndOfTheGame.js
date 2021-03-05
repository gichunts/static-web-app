import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

const GET_RESULTS = gql`
  query playerResults($gameId: ID!, $playerId: ID!) {
    playerResults(gameId: $gameId, playerId: $playerId) {
      submittedAnswer
      correct
      answers
      question
      correctAnswer
    }
  }
`;

const EndOfTheGame = () => {
  const { playerId, id } = useParams();

  const { data, loading } = useQuery(GET_RESULTS, {
    variables: { playerId, gameId: id },
  });

  if (loading && !data) {
    return <h1>loading...</h1>;
  }

  console.log(data);

  return (
    <div className="content-container">
      {data.playerResults.map((answer, id) => {
        console.log(answer.correct, 'dnwfjnekjn');
        const { question, correctAnswer, correct, submittedAnswer } = answer;
        return (
          <div key={id}>
            <h1>
              {correct ? '✅' : '❌'}
              {question}
            </h1>
            <br />
            <div style={{ marginLeft: '10px' }}>
              <h2>correct answer:{correctAnswer}</h2>
              <h2> your answer:{submittedAnswer}</h2>
              {/* <h2>{`${correct}`}</h2> */}
            </div>
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default EndOfTheGame;
