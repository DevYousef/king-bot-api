import kingbot from './src';

const gameworld = 'com4';
const email = 'mardy898@superrito.com';
const password = '1lT&HTML';
// only change if needed
const sitter_type = ''; // 'sitter' or 'dual'
const sitter_name = ''; // ingame avatar name
const port = 3000;

kingbot.start_server(gameworld, email, password, sitter_type, sitter_name, port);
