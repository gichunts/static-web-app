import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

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

// const CREATE_GAME = gql`
//   mutation {
//     createGame {
//       id
//     }
//   }
// `;

const PlayGame = () => {
  // const history=useHistory()
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_GAME, {
    variables: { id },
  });
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState();
  const [question, setQuestion] = useState();
  const [seconds, setSeconds] = useState(time);

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
      if (questions && questions.length != 0) {
        if (seconds === 0) {
          setSeconds(time);
          setQuestions(questions.slice(1));
        }

        setSeconds((seconds) => seconds - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds, questions]);

  useEffect(() => {
    if (questions && seconds != 0) {
      if (data.game.questions.length) {
        setQuestion(questions[0]);
      }
    }
  }, [questions]);

  console.log(answer);
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
                setQuestions(questions.slice(1));
                setSeconds(time);
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
