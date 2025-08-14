const User = require('../models/user-model');

const updateUserTheme = async (req, res) => {
  const { uid } = req.user;
  const { theme } = req.body;

  if (!['light', 'dark'].includes(theme)) {
    return res.status(400).json({ error: 'Tema inválido' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { theme },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ theme: updatedUser.theme });
  } catch (error) {
    console.error('Error al actualizar el tema:', error);
    res.status(500).json({ error: 'Error al actualizar el tema' });
  }
};

const getUserTheme = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ theme: user.theme });
  } catch (error) {
    console.error('Error al obtener el tema:', error);
    res.status(500).json({ error: 'Error al obtener el tema' });
  }
};

module.exports = {
  updateUserTheme,
  getUserTheme,
};