// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  // Initialize World ID Manager
  window.worldIDManager = new WorldIDManager();
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

  // Add verify button event listener
  const verifyButton = document.querySelector('.verify-button');
  if (verifyButton) {
    verifyButton.addEventListener('click', handleVerify);
  }
});

async function handleVerify() {
  if (!window.MiniKit || !window.MiniKit.isInstalled()) {
    alert('Esta función solo funciona en World App. Abre esta app dentro de World App.');
    return;
  }

  const verifyPayload = {
    action: 'game-verify-action', // Reemplaza con tu Action ID real
    signal: '0x12312', // Opcional
    verification_level: 'orb'
  };

  try {
    const { finalPayload } = await window.MiniKit.commandsAsync.verify(verifyPayload);
    if (finalPayload.status === 'error') {
      console.log('Error payload', finalPayload);
      alert('Error en verificación');
      return;
    }

    // Verify the proof in the backend
    const verifyResponse = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: finalPayload, // Parses only the fields we need to verify
        action: 'game-verify-action',
        signal: '0x12312', // Optional
      }),
    });

    // TODO: Handle Success!
    const verifyResponseJson = await verifyResponse.json();
    if (verifyResponseJson.status === 200) {
      console.log('Verification success!');
      alert('¡Verificación exitosa!');
    }
  } catch (error) {
    console.error('Error en verify', error);
    alert('Error en verificación');
  }
}
