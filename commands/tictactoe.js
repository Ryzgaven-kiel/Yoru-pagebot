const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  name: 'tictactoe',
  description: 'Play a Tic-Tac-Toe game against Cristian (AI Bot) with images!',
  usage: 'tictactoe <position>',
  author: 'Cristian',

  // Initialize an empty Tic-Tac-Toe board and define symbols
  board: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  botSymbol: '🤖', // Bot symbol
  userSymbol: '👤', // User symbol

  // Execute the game logic
  async execute(senderId, args, pageAccessToken) {
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

  // Function to display the board with images
  async displayBoard(senderId, pageAccessToken) {
    const images = this.board.map(cell => {
      if (cell === ' ') return 'https://example.com/empty.png'; // Link to an empty cell image
      if (cell === this.userSymbol) return 'https://example.com/user.png'; // Link to user symbol image
      if (cell === this.botSymbol) return 'https://example.com/bot.png'; // Link to bot symbol image
    });

    const boardMessage = `
      ${images[0]} | ${images[1]} | ${images[2]}
      ---------
      ${images[3]} | ${images[4]} | ${images[5]}
      ---------
      ${images[6]} | ${images[7]} | ${images[8]}
    `;

    await sendMessage(senderId, {
      attachment: {
        type: 'image',
        payload: {
          url: this.generateBoardImage(images)
        }
      }
    }, pageAccessToken);
  },

  // Generate an image representing the current board state
  generateBoardImage(images) {
    // Logic to create a composite image from the cell images
    // This can be done using a canvas library or a server-side image processing tool
    // For now, we will return a placeholder URL
    return 'https://example.com/generated_board_image.png'; // Placeholder for generated image
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
        this.board[i] = this.botSymbol;
        if (this.checkWin(this.botSymbol)) return i;
        this.board[i] = ' ';
        this.board[i] = this.userSymbol;
        if (this.checkWin(this.userSymbol)) {
          this.board[i] = ' ';
          return i;
        }
        this.board[i] = ' ';
      }
    }
    return this.board.findIndex(cell => cell === ' ');
  },

  // Reset the game board
  resetGame() {
    this.board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
  }
};
    
