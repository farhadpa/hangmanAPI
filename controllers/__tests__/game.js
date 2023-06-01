const gameController = require("../game");

const mockId = 'fda56100-0ddb-4f06-9ea4-7c1919ff6d2f';
jest.mock("uuid", () => ({ v4: () => mockId }));

describe("game controller", () => {

  describe("createGame", () => {
    it("Should return identifier when game created", () => {
      const req = {};
      const res = {
          status: jest.fn(() => res),
          json: jest.fn()
      };

      gameController.createGame(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockId)
    });
  });

  describe("getGame", () => {
    it("Should return 404 and json message 'Game Not Found'", () => {
      const req = {
        params: {
          gameId: "not valid Id"
        }
      }
      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      }

      gameController.getGame(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({Message: "Game Not Found."});
    })

    it("Should return 200 and game when found", () => {
      const req = {
        params: {
          gameId: mockId
        }
      }
      
      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      }


      gameController.getGame(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
    }) 
  })

  describe("createGuess", () => {
    it("Should return 400 when letter not supplied", () => {
      const req = {
          params: {
              gameId: mockId
          },
          body: {}
      };
      const res = {
          status: jest.fn(() => res),
          json: jest.fn()
      };

      gameController.createGuess(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
          Message: "Guess must be supplied with 1 letter"
      });
    });
    it("Should return 400 when letter is not a single character", () => {
      const req = {
          params: {
              gameId: mockId
          },
          body: {
              letter: "ab"
          }
      };
      const res = {
          status: jest.fn(() => res),
          json: jest.fn()
      };

      gameController.createGuess(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
          Message: "Guess must be supplied with 1 letter"
      });
    });

  it("Should return 400 when letter is a letter already guessed", () => {
      const req = {
          params: {
              gameId: mockId
          },
          body : {
              letter: "a"
          }
      };
      const res = {
          status: jest.fn(() => res),
          json: jest.fn()
      };
      gameController.createGuess(req, res);
      gameController.createGuess(req, res);
      expect(res.status).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith({
          Message: "Letter has already been guessed."
      });

    });
  })

  describe("deleteGame", () => {
    it("Should return 404 when game not found", () => {
      const req = {
        params: {
          gameId: "not valid Id"
        }
      }
      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      }

      gameController.deleteGame(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({Message: "Game Not Found."});
    })

    it("Should return 204 when game deleted", () => {
      const req = {
        params: {
          gameId: mockId
        }
      }
      const res = {
        sendStatus: jest.fn(),
      }

      gameController.deleteGame(req, res);

      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    })
  });

});