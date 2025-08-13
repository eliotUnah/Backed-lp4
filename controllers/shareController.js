// HU-10 compartir mi progreso
const Share = require('../models/Share');
const jwt = require('jsonwebtoken');

exports.generateShareToken = async (req, res, next) => {
    try {
        const { snapshotData } = req.body;
        
        if (!snapshotData) {
            return res.status(400).json({ error: 'Datos de snapshot requeridos' });
        }

        const token = jwt.sign(
            { snapshotData },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const newShare = new Share({ 
            token, 
            snapshotData,
            createdAt: new Date()
        });

        await newShare.save();

        res.status(201).json({ 
            success: true,
            token,
            shareUrl: `${req.protocol}://${req.get('host')}/share/${token}`
        });

    } catch (error) {
        console.error('Error en generateShareToken:', error);
        next(error);
    }
};

exports.getSharedData = async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ error: 'Token requerido' });
        }

        jwt.verify(token, process.env.JWT_SECRET);
        
        const shareDoc = await Share.findOne({ token });
        if (!shareDoc) {
            return res.status(404).json({ error: 'Enlace no encontrado o expirado' });
        }

        res.status(200).json({
            success: true,
            data: shareDoc.snapshotData,
            expiresAt: new Date(shareDoc.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
        });

    } catch (error) {
        console.error('Error en getSharedData:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'El enlace ha expirado',
                expiredAt: new Date(error.expiredAt).toISOString()
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        
        next(error);
    }
};

exports.verifyShareToken = async (req, res) => { // Eliminado el parámetro next no utilizado
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ valid: false, error: 'Token requerido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const shareDoc = await Share.findOne({ token });

        res.status(200).json({
            valid: !!shareDoc,
            expiresAt: new Date(decoded.exp * 1000),
            data: shareDoc?.snapshotData
        });

    } catch (error) {
        res.status(200).json({
            valid: false,
            error: error.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido'
        });
    }
}; 