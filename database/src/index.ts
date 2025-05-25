import { Server } from 'socket.io';
import axios from 'axios';
import drink from './api/drink/controllers/drink';
import { env } from 'process';

export default {
  register() {},

  bootstrap({ strapi }) {
    if (!strapi.server.httpServer) {
      console.error("Le serveur HTTP de Strapi n'est pas disponible.");
      return;
    }
    
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:3000", // Frontend URL
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on('connection', async (socket) => {
      console.log('Nouvelle connexion WebSocket');

      // Vérification du token (si applicable)
      const token = socket.handshake.query.token;
      if (token) {
        try {
          const response = await axios.get('http://localhost:1337/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const user = response.data;
          socket.join('group');
          socket.emit('welcome', { user: 'bot', text: `${user.username}, bienvenue !` });
        } catch (error) {
          console.log('Échec de l\'authentification WebSocket:', error.message);
          socket.disconnect();
          return;
        }
      } else {
        console.log('Aucun token fourni');
        socket.disconnect();
        return;
      }

      // Lors de la création d'un événement
      socket.on('createEvent', async (eventData) => {
        try {
          const createdEvent = await axios.post('http://localhost:1337/api/events', { data: eventData });
          // Émettre un événement WebSocket pour notifier les autres clients
          io.emit('event.create', createdEvent.data);
        } catch (error) {
          console.log('Erreur de création d\'événement:', error.message);
        }
      });

      // Lors de la mise à jour d'un événement
      socket.on('updateEvent', async (eventId, updatedData) => {
        try {
          const updatedEvent = await axios.put(`http://localhost:1337/api/events/${eventId}`, { data: updatedData });
          // Émettre un événement WebSocket pour notifier les autres clients
          io.emit('event.update', updatedEvent.data);
        } catch (error) {
          console.log('Erreur de mise à jour d\'événement:', error.message);
        }
      });

      // Lors de la suppression d'un événement
      socket.on('deleteEvent', async (documentId) => {
        try {
          await axios.delete(`http://localhost:1337/api/events/${documentId}`);
          // Émettre un événement WebSocket pour notifier les autres clients
          io.emit('event.delete', documentId);
        } catch (error) {
          console.log('Erreur de suppression de l\'événement:', error.message);
        }
      });

      socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
      });

    });

    const emitEvent = (model, action, result) => {
      if (result) { 
        try {
          const eventName = `${model}.${action}`;
          io.emit(eventName, result);
        } catch (err) {
          console.error('Erreur WebSocket:', err);
        }
      }
    };

    strapi.db.lifecycles.subscribe(async (event) => {
      if (event.model.uid === 'api::event.event') {
        emitEvent('event', event.action, event.result);
      }
    
      if (event.model.uid === 'api::drink.drink') {
        emitEvent('drink', event.action, event.result);
      }

      if (event.model.uid === 'api::drink-category.drink-category') {
        emitEvent('drink-category', event.action, event.result);
      }
    });
  },
};