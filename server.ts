import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  
  // Set up Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const parties = new Map(); // partyCode -> { players: [{id, name, score}] }

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('create_party', ({ playerName }) => {
      const partyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      parties.set(partyCode, {
        host: socket.id,
        players: [{ id: socket.id, name: playerName, score: 0 }],
        state: 'lobby'
      });
      socket.join(partyCode);
      socket.emit('party_created', { partyCode, players: parties.get(partyCode).players });
    });

    socket.on('join_party', ({ partyCode, playerName }) => {
      const code = partyCode.toUpperCase();
      if (parties.has(code)) {
        const party = parties.get(code);
        if (party.state !== 'lobby') {
          socket.emit('error', { message: 'Spiel läuft bereits' });
          return;
        }
        party.players.push({ id: socket.id, name: playerName, score: 0 });
        socket.join(code);
        io.to(code).emit('party_updated', { players: party.players });
        socket.emit('party_joined', { partyCode: code, players: party.players });
      } else {
        socket.emit('error', { message: 'Party nicht gefunden' });
      }
    });

    socket.on('start_game', ({ partyCode }) => {
       const party = parties.get(partyCode);
       if (party && party.host === socket.id) {
         party.state = 'playing';
         io.to(partyCode).emit('game_started');
       }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Clean up player from parties
      for (const [code, party] of parties.entries()) {
        const playerIndex = party.players.findIndex(p => p.id === socket.id);
        if (playerIndex !== -1) {
          party.players.splice(playerIndex, 1);
          if (party.players.length === 0) {
            parties.delete(code);
          } else {
            if (party.host === socket.id) {
              party.host = party.players[0].id; // Reassign host
            }
            io.to(code).emit('party_updated', { players: party.players });
          }
          break;
        }
      }
    });
  });

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Need to define __dirname for ESM
    const __dirname = path.resolve();
    const distPath = path.join(__dirname, 'dist');
    app.use('/Wirtschaftprofi', express.static(distPath));
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
