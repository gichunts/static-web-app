const axios = require("axios");

const games = [];
const history =
  "On October 29, 1969, ARPAnet delivered its first message: a “node-to-node” communication from one computer to another. (The first computer was located in a research lab at UCLA and the second was at Stanford; each one was the size of a small house.) The message—“LOGIN”—was short and simple, but it crashed the fledgling ARPA network anyway: The Stanford computer only received the note’s first two letters.";

const TRIVIA_API = "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple";
const QUESTIONS = {
  results: [
    { question: "Who was the first computer programmer ?", correct_answer: "Ada Lovelace", incorrect_answers: ["Alick Glennie", "Konrad Zuse", "John Backus"] },
    { question: "Which was the first `pay as you go` code execution platform?", correct_answer: "Zimki", incorrect_answers: ["Cloudflare", "Microsoft Azure", "AWS Lambda"] },
    {
      question: "How are the keys for the RSA algorithm generated?",
      correct_answer:
        "A user of the algorithm creates and publishes a public key based on two large prime numbers, which are kept secret along with an auxiliary value. Messages can be encrypted by anyone, via the public key, but can only be decoded by someone who knows the prime numbers",
      incorrect_answers: [
        "Each cipher encrypts and decrypts data in blocks of 128 bits using cryptographic keys of 128, 192 and 256 bits, respectively.",
        "ciphers encrypt the plaintext by swapping each letter or symbol in the plaintext by a different symbol as directed by the key. ... Each letter of the alphabet is assigned a number—that is, A is 0, B is 1, and so on, through Z at 25. The set of letters used can be more complex.",
        " it has a 64-bit block size and a variable key length from 32 bits up to 448 bits. It is a 16-round Feistel cipher and uses large key-dependent S-boxes",
      ],
    },
    { question: "What was the name of the security vulnerability found in Bash in 2014?", correct_answer: "Shellshock", incorrect_answers: ["Heartbleed", "Bashbug", "Stagefright"] },
    { question: "Which RAID array type is associated with data mirroring?", correct_answer: "RAID 1", incorrect_answers: ["RAID 0", "RAID 10", "RAID 5"] },
    { question: "What is the name given to layer 4 of the Open Systems Interconnection (ISO) model?", correct_answer: "Transport", incorrect_answers: ["Session", "Data link", "Network"] },
    {
      question: "Who invented the &quot;Spanning Tree Protocol&quot;?",
      correct_answer: "Radia Perlman",
      incorrect_answers: ["Paul Vixie", "Vint Cerf", "Michael Roberts"],
    },
    {
      question: "What type of sound chip does the Super Nintendo Entertainment System (SNES) have?",
      correct_answer: "ADPCM Sampler",
      incorrect_answers: ["FM Synthesizer", "Programmable Sound Generator (PSG)", "PCM Sampler"],
    },
    {
      question: "Which of the following computer components can be built using only NAND gates?",
      correct_answer: "ALU",
      incorrect_answers: ["CPU", "RAM", "Register"],
    },
    {
      question: "Lenovo acquired IBM's personal computer division, including the ThinkPad line of laptops and tablets, in what year?",
      correct_answer: "2005",
      incorrect_answers: ["1999", "2002", "2008"],
    },
    {
      question: "Who is the founder of Palantir?",
      correct_answer: "Peter Thiel",
      incorrect_answers: ["Mark Zuckerberg", "Marc Benioff", "Jack Dorsey"],
    },
    {
      question: "In 1969, ARPAnet delivered its first message: a “node-to-node” communication from one computer to another. The content of the message was",
      correct_answer: "Login",
      incorrect_answers: ["Hello World", "Hello", "Sign In"],
    },
    {
      question:
        " In 1959 a new programming language COBOL(common business-oriented language) was designed by CODASYL and was partly based on the programming language FLOW-MATIC.Who was the main developper of both FLOW-MATIC and COBOL? ",
      correct_answer: "Grace Hopper",
      incorrect_answers: [" Mary K. Hawes", "Jean Sammet ", "Saul Gorn"],
    },
  ],
};

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

    playerResults: (_, { gameId, playerId }) => {
      const game = games.find((g) => g.id === gameId);

      if (!game) {
        throw new ValidationError("No game found!");
      }

      const player = game.players.find((p) => p.id === playerId);

      return player.answers.map((answer) => {
        return {
          submittedAnswer: answer.answer,
          correctAnswer: answer.question.correctAnswer,
          question: answer.question.question,
          name: player.name,
          answers: answer.question.answers,
          correct: answer.question.correctAnswer === answer.answer,
        };
      });
    },
  },
  Mutation: {
    createGame: async () => {
      // const questions = await axios.get(TRIVIA_API);
      const id = idGenerator();
      const game = {
        id: id,
        players: [],
        questions: QUESTIONS.results.map((q) => {
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
