/**
 * Boosta SMM Panel — Liquid Glass Micro-Interactions & iOS Physics
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroCard = document.getElementById('heroAssetCard');
  const chatBubble = document.getElementById('chatBubble');
  const btnGetStarted = document.getElementById('btnGetStarted');
  const btnLogIn = document.getElementById('btnLogIn');
  const heroImage = document.getElementById('heroImage');
  const characterFallback = document.getElementById('characterFallback');

  // Trigger haptic feedback if available (iOS / Android Web API)
  const triggerHaptic = (style = 15) => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(style);
      } catch (e) {
        // Silent fallback
      }
    }
  };

  // 1. Sleek Gyroscope / Cursor Parallax on the Liquid Glass Container
  const handleMove = (xRatio, yRatio) => {
    const moveX = (xRatio - 0.5) * 16;
    const moveY = (yRatio - 0.5) * 16;

    if (heroCard) {
      heroCard.style.transform = `translate(${moveX * 0.8}px, ${moveY * 0.8}px) scale(1)`;
    }
    if (chatBubble) {
      chatBubble.style.transform = `translate(${moveX * 1.2}px, ${moveY * 1.2}px)`;
    }
    const chips = document.querySelectorAll('.floating-chip');
    chips.forEach((chip, i) => {
      const depth = 1 + i * 0.4;
      chip.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
    });
  };

  // Pointer movement on desktop
  window.addEventListener('mousemove', (e) => {
    const xRatio = e.clientX / window.innerWidth;
    const yRatio = e.clientY / window.innerHeight;
    handleMove(xRatio, yRatio);
  });

  // Device orientation / Gyro on mobile iOS devices
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        // Gamma: left-to-right tilt (-90 to 90)
        // Beta: front-to-back tilt (-180 to 180)
        const xRatio = Math.min(Math.max((e.gamma + 30) / 60, 0), 1);
        const yRatio = Math.min(Math.max((e.beta - 20) / 60, 0), 1);
        handleMove(xRatio, yRatio);
      }
    }, { passive: true });
  }

  // 2. Chat Bubble Tap Interaction (Greeting replay / micro-bounce)
  if (chatBubble) {
    chatBubble.addEventListener('click', () => {
      triggerHaptic(20);
      chatBubble.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.35)';
      chatBubble.style.transform = 'scale(1.04) translateY(-6px)';
      setTimeout(() => {
        chatBubble.style.transform = 'scale(1) translateY(0)';
      }, 300);
    });
  }

  // 3. Supported Service Pills Interaction (Connects with Mickey's Chat Bubble)
  const servicePills = document.querySelectorAll('.service-pill');
  const serviceResponses = {
    'Instagram': "Ready to explode your Instagram reach? Followers, Reels views & likes on deck! 📸",
    'TikTok': "TikTok viral algorithm unlocked! Instant views, authentic likes & followers! ⚡",
    'Telegram': "Boost your Telegram channel! Real members, post views & reactions ready! ✈️",
    'YouTube': "Monetize faster on YouTube! High-retention watch hours & subscribers! 🎬",
    'X': "Dominate the X timeline! Retweets, impressions & verified followers ready! 🚀"
  };

  servicePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      triggerHaptic(18);
      createRipple(e, pill, 'rgba(0, 49, 82, 0.12)');
      
      const name = pill.querySelector('.service-name')?.textContent.trim() || 'TikTok';
      if (chatBubble && serviceResponses[name]) {
        const msgEl = chatBubble.querySelector('.chat-message');
        if (msgEl) {
          msgEl.style.opacity = '0';
          msgEl.style.transform = 'translateY(4px)';
          setTimeout(() => {
            msgEl.textContent = serviceResponses[name];
            msgEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            msgEl.style.opacity = '1';
            msgEl.style.transform = 'translateY(0)';
          }, 150);
        }
      }
    });
  });

  // 4. Button Click Interactions with Spring Physics
  if (btnGetStarted) {
    btnGetStarted.addEventListener('click', (e) => {
      triggerHaptic([20, 40, 20]);
      createRipple(e, btnGetStarted, 'rgba(255, 255, 255, 0.4)');
      
      const originalText = btnGetStarted.querySelector('.btn-text').textContent;
      btnGetStarted.querySelector('.btn-text').textContent = 'Launching...';
      btnGetStarted.style.transform = 'scale(0.96)';

      setTimeout(() => {
        btnGetStarted.querySelector('.btn-text').textContent = originalText;
        btnGetStarted.style.transform = '';
      }, 1200);
    });
  }

  if (btnLogIn) {
    btnLogIn.addEventListener('click', (e) => {
      triggerHaptic(15);
      createRipple(e, btnLogIn, 'rgba(0, 49, 82, 0.15)');
      
      const originalText = btnLogIn.querySelector('.btn-text').textContent;
      btnLogIn.querySelector('.btn-text').textContent = 'Opening...';
      btnLogIn.style.transform = 'scale(0.96)';

      setTimeout(() => {
        btnLogIn.querySelector('.btn-text').textContent = originalText;
        btnLogIn.style.transform = '';
      }, 1200);
    });
  }

  // Dynamic touch ripple micro-effect
  function createRipple(event, button, color) {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.position = 'absolute';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.borderRadius = '50%';
    ripple.style.background = color;
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'btnRipple 0.6s linear forwards';

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // Inject dynamic ripple keyframes if not present
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes btnRipple {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // 4. Asset Auto-Detection for assets/mickey.png (and fallback assets/mickey.jpg)
  let checkCount = 0;
  const pollForAsset = () => {
    if (checkCount > 10) return;
    checkCount++;

    const testImg = new Image();
    testImg.src = `assets/mickey.png?v=${Date.now()}`;
    testImg.onload = () => {
      if (heroImage && characterFallback) {
        heroImage.src = testImg.src;
        heroImage.style.display = 'block';
        characterFallback.style.display = 'none';
      }
    };
  };

  const assetInterval = setInterval(pollForAsset, 3000);
  setTimeout(() => clearInterval(assetInterval), 30000);
});
