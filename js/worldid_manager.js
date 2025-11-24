// World ID Manager for 2048 Mini App
(function() {
  var WorldIDManager = function() {
    this.verified = false;
    this.init();
  };

  WorldIDManager.prototype.init = function() {
    // Initialize MiniKit if available
    if (window.MiniKit) {
      window.MiniKit.install();
    }
  };

  WorldIDManager.prototype.verifyFirstMove = function(callback) {
    var self = this;

    if (!window.MiniKit || !window.MiniKit.isInstalled()) {
      // If not in MiniKit, allow the move
      this.verified = true;
      callback();
      return;
    }

    if (this.verified) {
      callback();
      return;
    }

    var verifyPayload = {
      action: '2048-action',
      signal: 'first-move-' + Date.now(), // Unique signal
      verification_level: 'orb' // Use orb for verification
    };

    window.MiniKit.commandsAsync.verify(verifyPayload).then(function (response) {
      if (response.finalPayload.status === 'success') {
        // Send to backend for verification
        return fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payload: response.finalPayload,
            action: '2048-action',
            signal: verifyPayload.signal
          }),
        });
      } else {
        throw new Error('Verification failed');
      }
    }).then(function (verifyResponse) {
      return verifyResponse.json();
    }).then(function (data) {
      if (data.success) {
        self.verified = true;
        callback();
      } else {
        console.error('Backend verification failed:', data);
        alert('Verificación fallida. Intenta de nuevo.');
      }
    }).catch(function (error) {
      console.error('Verification error:', error);
      alert('Error en verificación. Intenta de nuevo.');
    });
  };

  // Make it globally available
  window.WorldIDManager = WorldIDManager;
})();