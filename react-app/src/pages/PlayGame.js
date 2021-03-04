import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';

const time = 5;
const GET_GAME = gql`
  query getGame($id: ID!) {
    game(id: $id) {
      questions {
        id
        answers
      }
      players {
        name
        answers {
          answer
        }
      }
    }
  }
`;
const SUBMIT_ANSWER = gql`
  mutation submitAnswer(
    $gameId: ID!
    $playerId: ID!
    $questionId: ID!
    $answer: String
  ) {
    submitAnswer(
      gameId: $gameId
      playerId: $playerId
      questionId: $questionId
      answer: $answer
    ) {
      id
    }
  }
`;

const PlayGame = () => {
  const history = useHistory();
  const { id, playerId } = useParams();
  const { data } = useQuery(GET_GAME, {
    variables: { id },
  });

  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState();
  const [question, setQuestion] = useState();
  const [seconds, setSeconds] = useState(time);

  const [submitAnswer] = useMutation(SUBMIT_ANSWER);
  useEffect(() => {
    console.log('inside data');
    if (data) {
      if (data.game.questions.length) {
        const q = data.game.questions;
        setQuestions(q);
      }
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (questions && questions.length !== 0) {
        if (seconds === 0) {
          setSeconds(time);
          setQuestions(questions.slice(1));
        }

        setSeconds((seconds) => seconds - 1);
      } else if (questions.length === 0) {
        history.push(`/game/finish/${id}/${playerId}`);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds, questions, id, playerId, history]);

  useEffect(() => {
    if (questions && seconds !== 0) {
      if (data.game.questions.length) {
        setQuestion(questions[0]);
      }
    }
  }, [questions, data, seconds]);

  useEffect(() => {
    if (question && seconds === 0) {
      submitAnswer({
        variables: { gameId: id, playerId, questionId: question.id, answer },
      });
    }
  }, [submitAnswer, id, playerId, question, answer, seconds]);

  // console.log(answer);
  return (
    <div>
      <h1>Game id: {id}</h1>
      {data && (
        <div className="content-container">
          <div className="content-title-group not-found">
            <h2 className="title">
              {question ? `Time remaining:${seconds}` : `end of quiz`}
            </h2>
            <ul>
              {question && (
                <div>
                  <h1>{question.id}</h1>
                  {question.answers.map((a) => {
                    return (
                      <li key={a}>
                        <label>
                          <input
                            type="radio"
                            value={a}
                            onChange={() => {
                              setAnswer(a);
                            }}
                            name="answer"
                          />
                          {a}
                        </label>
                      </li>
                    );
                  })}
                  <br />
                </div>
              )}
            </ul>

            <button
              onClick={() => {
                // setQuestions(questions.slice(1));
                setSeconds(0);
              }}
            >
              {question ? `Submit Answer` : `see your results`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayGame;

// import React, { useEffect, useState } from 'react';

// const App = () => {
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setCount(2);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   console.log('hello');
//   return <div>Hello, World</div>;
// };

// export default App;
