const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend-controller');
const authenticateUser = require('../middlewares/authenticateUser');

// Enviar solicitud de amistad por correo
router.post('/invite', authenticateUser, friendController.sendRequest);

// Aceptar solicitud por ID
router.patch('/accept/:friendshipId', authenticateUser, friendController.acceptRequest);

// Rechazar solicitud por ID
router.patch('/reject/:friendshipId', authenticateUser, friendController.rejectRequest);

// Obtener solo amigos aceptados del usuario autenticado
router.get('/friends', authenticateUser, friendController.getFriends);

// Obtener solicitudes pendientes del usuario 
router.get('/requests/pending', authenticateUser, friendController.getPendingRequests);

// Obtener solicitudes pendientes del usuario 
router.get('/search',authenticateUser, friendController.searchUserByEmail);


module.exports = router;
 