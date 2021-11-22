import dotenv from 'dotenv';
import Server from './index';

// Configurar dot.env
dotenv.config();

const server = new Server();

server.listen();