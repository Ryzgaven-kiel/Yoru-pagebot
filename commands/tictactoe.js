const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  name: 'tictactoe',
  description: 'Play a Tic-Tac-Toe game against Cristian (AI Bot)',
  usage: 'tictactoe <position>',
  author: 'Cristian AI Bot',

  // Initialize an empty Tic-Tac-Toe board and define the bot's move symbol
  board: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  botSymbol: 'O',
  userSymbol: 'X',

  // Execute the game logic
  async execute(senderId, args, pageAccessToken) {
    // Position input from the user (1-9)
    const position = parseInt(args[0], 10) - 1;

    // Validate position input
    if (isNaN(position) || position < 0 || position > 8 || this.board[position] !== ' ') {
      return await sendMessage(senderId, { text: 'Invalid move. Please choose a position from 1 to 9.' }, pageAccessToken);
    }

    // User's move
    this.board[position] = this.userSymbol;

    // Check for user win
    if (this.checkWin(this.userSymbol)) {
      await this.displayBoard(senderId, pageAccessToken);
      return await sendMessage(senderId, { text: '🎉 You win! 🎉' }, pageAccessToken);
    }

    // Check for a draw
    if (this.isBoardFull()) {
      await this.displayBoard(senderId, pageAccessToken);
      return await sendMessage(senderId, { text: "It's a draw!" }, pageAccessToken);
    }

    // Bot's move
    const botMove = this.getBotMove();
    this.board[botMove] = this.botSymbol;

    // Check for bot win
    if (this.checkWin(this.botSymbol)) {
      await this.displayBoard(senderId, pageAccessToken);
      return await sendMessage(senderId, { text: 'Cristian wins! 😎' }, pageAccessToken);
    }

    // Check for a draw again after bot's move
    if (this.isBoardFull()) {
      await this.displayBoard(senderId, pageAccessToken);
      return await sendMessage(senderId, { text: "It's a draw!" }, pageAccessToken);
    }

    // Display the updated board and continue the game
    await this.displayBoard(senderId, pageAccessToken);
    await sendMessage(senderId, { text: "Your move! Choose a position from 1 to 9." }, pageAccessToken);
  },

  // Function to display the board
  async displayBoard(senderId, pageAccessToken) {
    const boardDisplay = `
      ${this.board[0]} | ${this.board[1]} | ${this.board[2]}
      ---------
      ${this.board[3]} | ${this.board[4]} | ${this.board[5]}
      ---------
      ${this.board[6]} | ${this.board[7]} | ${this.board[8]}
    `;
    await sendMessage(senderId, { text: boardDisplay }, pageAccessToken);
  },

  // Check for a win
  checkWin(symbol) {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    return winningCombos.some(combo => combo.every(index => this.board[index] === symbol));
  },

  // Check if board is full
  isBoardFull() {
    return this.board.every(cell => cell !== ' ');
  },

  // Determine the bot's move
  getBotMove() {
    // Try to win or block if possible
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === ' ') {
        // Check if bot can win
        this.board[i] = this.botSymbol;
        if (this.checkWin(this.botSymbol)) return i;
        this.board[i] = ' ';
        
        // Check if bot needs to block user
        this.board[i] = this.userSymbol;
        if (this.checkWin(this.userSymbol)) {
          this.board[i] = ' ';
          return i;
        }
        this.board[i] = ' ';
      }
    }

    // Default to first available spot if no immediate win or block is found
    return this.board.findIndex(cell => cell === ' ');
  },

  // Reset the game board
  resetGame() {
    this.board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
  }
};
                               
