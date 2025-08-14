const Friendship = require('../models/friend-model');
const User = require('../models/user-model');

// Enviar solicitud de amistad
exports.sendRequest = async (req, res) => {
  const { recipientEmail } = req.body;
  const requesterUid = req.user.uid; // 👈 extraído del token por el middleware

  try {
    // Buscar destinatario por email
    const recipient = await User.findOne({ email: recipientEmail });

    if (!recipient) {
      return res.status(404).json({ message: "❌ El usuario con ese correo no existe." });
    }

    if (recipient.uid === requesterUid) {
      return res.status(400).json({ message: "⚠️ No puedes enviarte una solicitud a ti mismo." });
    }

    // Verificar si ya existe una solicitud entre estos dos UID
    const existing = await Friendship.findOne({
      $or: [
        { requester: requesterUid, recipient: recipient.uid },
        { requester: recipient.uid, recipient: requesterUid }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "⚠️ Ya existe una solicitud entre estos usuarios." });
    }

    // Crear nueva solicitud
    const friendship = new Friendship({
      requester: requesterUid,
      recipient: recipient.uid,
      status: "pending"
    });

    await friendship.save();

    res.status(201).json({ message: "✅ Solicitud enviada correctamente.", friendship });
  } catch (err) {
    console.error("Error en sendRequest:", err);
    res.status(500).json({ message: "🚨 Error al enviar solicitud.", error: err.message });
  }
};

// Aceptar solicitud de amistad
exports.acceptRequest = async (req, res) => {
  const { friendshipId } = req.params;
  const userUid = req.user.uid;

  try {
    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      return res.status(404).json({ message: "❌ Solicitud no encontrada." });
    }

    if (friendship.recipient !== userUid) {
      return res.status(403).json({ message: "🚫 No estás autorizado para aceptar esta solicitud." });
    }

    if (friendship.status === 'accepted') {
      return res.status(400).json({ message: "⚠️ La solicitud ya fue aceptada." });
    }

    friendship.status = 'accepted';
    await friendship.save();

    res.status(200).json({
      message: "✅ Solicitud aceptada correctamente.",
      friendship
    });
  } catch (err) {
    res.status(500).json({
      message: "🚨 Error al aceptar la solicitud.",
      error: err.message
    });
  }
}; 
// Rechazar solicitud de amistad
exports.rejectRequest = async (req, res) => {
  const { friendshipId } = req.params;
  const userUid = req.user.uid;

  try {
    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      return res.status(404).json({ message: "❌ Solicitud no encontrada." });
    }

    if (friendship.recipient !== userUid) {
      return res.status(403).json({ message: "🚫 No estás autorizado para rechazar esta solicitud." });
    }

    if (friendship.status !== 'pending') {
      return res.status(400).json({ message: "⚠️ La solicitud ya fue procesada." });
    }

    // Puedes eliminarla o marcarla como rechazada
    await friendship.deleteOne();

    res.status(200).json({
      message: "❌ Solicitud rechazada correctamente."
    });
  } catch (err) {
    res.status(500).json({
      message: "🚨 Error al rechazar la solicitud.",
      error: err.message
    });
  }
};



// Ver solo amigos aceptados
exports.getFriends = async (req, res) => {
  const userUid = req.user.uid;

  try {
    // Buscar amistades aceptadas donde el usuario es requester o recipient
    const friendships = await Friendship.find({
      status: 'accepted',
      $or: [
        { requester: userUid },
        { recipient: userUid }
      ]
    });

    // Obtener los UID del otro usuario en cada amistad
    const friendUids = friendships.map(f =>
      f.requester === userUid ? f.recipient : f.requester
    );

    // Buscar los datos de esos usuarios
    const friendsData = await User.find({ uid: { $in: friendUids } }).select('uid email');

    res.json(friendsData);
  } catch (err) {
    console.error("Error en getFriends:", err);
    res.status(500).json({ message: "🚨 Error al obtener amigos.", error: err.message });
  }
};


// Obtener solicitudes pendientes del usuario autenticado
exports.getPendingRequests = async (req, res) => {
  const userUid = req.user.uid;

  try {
    // Buscar solicitudes pendientes donde el usuario autenticado es el destinatario
    const pendingRequests = await Friendship.find({
      recipient: userUid,
      status: 'pending'
    });

    // Extraer los UID de los solicitantes
    const requesterUids = pendingRequests.map(f => f.requester);

    // Buscar los usuarios solicitantes por UID
    const users = await User.find({ uid: { $in: requesterUids } }).select('uid email');

    // Formatear la respuesta
    const requests = pendingRequests.map(f => {
      const user = users.find(u => u.uid === f.requester);
      return {
        _id: f._id,
        requester: {
          uid: user?.uid,
          email: user?.email || null
        },
        createdAt: f.createdAt
      };
    });

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error en getPendingRequests:", err);
    res.status(500).json({
      message: "🚨 Error al obtener solicitudes pendientes.",
      error: err.message
    });
  }
};

// obtener usuarios por correo
exports.searchUserByEmail = async (req, res) => {
  const rawEmail = req.query.email;

  if (!rawEmail) {
    return res.status(400).json({ message: 'El correo es requerido' });
  }
  
  const email = rawEmail.trim(); // elimina espacios

  try {
    const user = await User.findOne({
      email: new RegExp(`^${email}$`, 'i') // búsqueda insensible a mayúsculas
    }).select('email');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ email: user.email });
  } catch (err) {
    console.error('Error al buscar usuario:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


