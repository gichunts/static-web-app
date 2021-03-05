import React, { useState, useEffect } from 'react';
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

  const [questionNumber, setQuestionNumber] = useState(0);

  useEffect(() => {
    if (data) {
      setQuestionNumber(data.playerResults.length);
    }
  }, [data]);

  if (loading && !data) {
    return <h1>loading...</h1>;
  }
  const correctAns = [];
  console.log(correctAns, 'hello');

  return (
    <div className="content-container">
      {data.playerResults.map((answer, id) => {
        const { question, correctAnswer, correct, submittedAnswer } = answer;
        if (correct) {
          correctAns.push('1');
        }
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
            </div>
            <br />
          </div>
        );
      })}
      <h1>
        Your score is {Math.floor((correctAns.length / questionNumber) * 100)}%
      </h1>
    </div>
  );
};

export default EndOfTheGame;

// import React, { setState } from 'react';
// import { gql, useQuery } from '@apollo/client';
// import { useParams } from 'react-router-dom';

// const GET_RESULTS = gql`
//   query playerResults($gameId: ID!, $playerId: ID!) {
//     playerResults(gameId: $gameId, playerId: $playerId) {
//       submittedAnswer
//       correct
//       answers
//       question
//       correctAnswer
//     }
//   }
// `;

// const EndOfTheGame = () => {
//   const { playerId, id } = useParams();
//   const [questionNumber, setQuestionNumber] = setState(0);

//   const { data, loading } = useQuery(GET_RESULTS, {
//     variables: { playerId, gameId: id },
//   });

//   if (loading && !data) {
//     return <h1>loading...</h1>;
//   }

//   // console.log(data);
//   const correctAnswers = 0;

//   // setQuestionNumber(data.playerResults.length);
//   console.log(correctAnswers, questionNumber, ' correctAnswers');

//   return (
//     <div className="content-container">
//       {data.playerResults.map((answer, id) => {
//         const { question, correctAnswer, correct, submittedAnswer } = answer;
//         // if (correct) {
//         //   correctAnswers = correctAnswers + 1;
//         // }
//         return (
//           <div key={id}>
//             <h1>
//               {correct ? '✅' : '❌'}
//               {question}
//             </h1>
//             <br />
//             <div style={{ marginLeft: '10px' }}>
//               <h2>correct answer:{correctAnswer}</h2>
//               <h2> your answer:{submittedAnswer}</h2>
//               {/* <h2>{`${correct}`}</h2> */}
//             </div>
//             <br />
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default EndOfTheGame;
