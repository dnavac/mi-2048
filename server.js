const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.'))); // Servir archivos estáticos

// Endpoint de verificación
app.post('/api/verify', async (req, res) => {
  try {
    const { verifyCloudProof } = await import('@worldcoin/minikit-js');

    const { payload, action, signal } = req.body;

    const app_id = process.env.APP_ID;
    if (!app_id) {
      return res.status(500).json({ message: 'APP_ID not configured' });
    }

    const verifyRes = await verifyCloudProof(payload, app_id, '2048-action', signal);

    if (verifyRes.success) {
      console.log('Verificación exitosa para action:', action);
      return res.status(200).json({
        success: true,
        message: 'Verificación exitosa',
        verifyRes
      });
    } else {
      console.log('Error en verificación:', verifyRes);
      return res.status(400).json({
        success: false,
        message: 'Verificación fallida',
        verifyRes
      });
    }
  } catch (error) {
    console.error('Error en endpoint de verify:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta catch-all para SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});