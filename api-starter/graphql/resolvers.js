const axios = require("axios");

const games = [];
const TRIVIA_API = "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple";

const idGenerator = () => {
  const chars = "qwertyuioplkjhgfdsazxcvbnm";

  let code = "";

  for (let i = 0; i < 4; i++) {
    const random = Math.floor(Math.random() * chars.length);
    code += chars[random];
  }

  return code;
};

const resolvers = {
  Query: {
    hello: () => {
      return "Nice!";
    },
    game: (_, { id }) => {
      const game = games.find((g) => g.id === id);
      if (!game) {
        throw new Error("no game found");
      }
      return game;
    },
    games: () => {
      return games;
    },
  },
  Mutation: {
    createGame: async () => {
      const questions = await axios.get(TRIVIA_API);
      const id = idGenerator();
      const game = {
        id: id,
        players: [],
        questions: questions.data.results.map((q) => {
          return {
            id: q.question,
            question: q.question,
            correctAnswer: q.correct_answer,
            answers: q.incorrect_answers.concat(q.correct_answer),
          };
        }),
      };
      games.push(game);
      return game;
    },
    addPlayerToGame: async (_, { id, name }) => {
      const game = games.find((g) => g.id === id);
      console.log(game, "gameidididi");
      if (!game) {
        throw new Error("NO GAME Found");
      }
      const playerId = idGenerator();
      const player = {
        id: playerId,
        name,
        answers: [],
      };
      console.log(player, "playeridididi");

      game.players.push(player);

      return player;
    },

    submitAnswer: async (_, { gameId, playerId, questionId, answer }) => {
      const game = games.find((g) => g.id === gameId);

      const player = game.players.find((p) => p.id === playerId);

      if (!game) {
        throw new Error("NO GAME Found");
      }
      if (!player) {
        throw new Error("NO Player Found");
      }

      const question = game.questions.find((q) => q.id === questionId);
      player.answers.push({ answer, question });

      return player;
    },
  },
};

module.exports = resolvers;
