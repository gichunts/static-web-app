const { gql } = require("apollo-server-azure-functions");

const typeDef = gql`
  type Question {
    id: ID!
    question: String!
    correctAnswer: String!
    answers: [String!]!
  }

  type Answer {
    answer: String!
    question: Question!
  }

  type Player {
    id: ID!
    name: String!
    answers: [Answer!]!
  }

  type Game {
    id: ID!
    players: [Player!]!
    questions: [Question!]!
  }

  type PlayerResult {
    name: String!
    question: String!
    submittedAnswer: String!
    correctAnswer: String!
    answers: [String!]!
    correct: Boolean
  }

  type Query {
    createGame: String
    hello: String
    game(id: ID!): Game
    games: [Game!]!
    playerResults(gameId: ID!, playerId: ID!): [PlayerResult!]!
  }

  type Mutation {
    createGame: Game
    addPlayerToGame(id: ID!, name: String!): Player!
    startGame(id: ID!): Game
    submitAnswer(gameId: ID!, playerId: ID!, questionId: ID!, answer: String!): Player
  }
`;

module.exports = typeDef;
