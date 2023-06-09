const { v4: uuid } = require("uuid");

const words = ["Banana", "Canine", "Unosquare", "Airport"];
const games = {};

const retrieveWord = () => words[Math.floor(Math.random() * words.length)];

const clearUnmaskedWord = (game) => {
    const withoutUnmasked = { 
        ...game,
    };
    delete withoutUnmasked.unmaskedWord;
    delete withoutUnmasked.lettersGuessed;
    return withoutUnmasked;
}


function createGame(req, res) {
  const newGameWord = retrieveWord().toLowerCase();
  const newGameId = uuid();
  const newGame = {
    remainingGuesses: 6,
    unmaskedWord: newGameWord,
    word: newGameWord.replaceAll(/[a-zA-Z0-9]/g, "_"),
    status: "In Progress",
    incorrectGuesses: [],
    lettersGuessed: [],
  };

  games[newGameId] = newGame;

  res.status(201).json(newGameId);
}

function getGame(req, res) { 
    const { gameId } = req.params;
    if (!gameId) return res.sendStatus(404);

    var game = games[gameId];
    if (!game) {
        return res.status(404).json({
            Message: "Game Not Found."
        }); 
    }

    return res.status(200).json(clearUnmaskedWord(game));
}

function createGuess(req, res) { 
    const { gameId } = req.params;
    let { letter } = req.body;


    var game = games[gameId];
    if (!game) return res.status(404).json({
        Message: "Game Not Found."
    }); 

    if (!letter || letter.length != 1) {
        return res.status(400).json({
            Message: "Guess must be supplied with 1 letter"
        })
    }

    letter = letter.toLowerCase();

    // todo: add logic for making a guess, modifying the game and updating the status

    if (game.status !== "In Progress") {
        return res.status(400).json({
            Message: "Game Not In Progress"
        })
    }

    if (game.lettersGuessed.includes(letter)) {
        return res.status(400).json({
            Message: "Letter has already been guessed."
        })
    }

    game.lettersGuessed.push(letter);

    if (!game.unmaskedWord.includes(letter)) {
        game.remainingGuesses--;
        game.incorrectGuesses.push(letter);
        if (game.remainingGuesses < 1) {
            game.status = "Lost"
            return res.status(201).json(clearUnmaskedWord(game));
        }
        return res.status(201).json(clearUnmaskedWord(game));
    }

    const wordArray = game.word.split("");
    for (let i = 0; i < game.unmaskedWord.length; i++) {
        if (game.unmaskedWord[i] === letter) {
            wordArray[i] = letter;
        }
    }
    game.word = wordArray.join("");

    if (game.word === game.unmaskedWord) {
        game.status = "Won";
        return res.status(201).json(clearUnmaskedWord(game));
    }

    return res.status(201).json(clearUnmaskedWord(game));
}

function deleteGame(req, res) {
    const { gameId } = req.params;
    const game = games[gameId];

    if (!game) return res.status(404).json({Message: "Game Not Found."});
    delete games[gameId];
    return res.sendStatus(204)
}

module.exports = {
    createGame,
    getGame,
    createGuess,
    deleteGame,
  };