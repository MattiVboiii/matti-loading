(() => {
  const cfg = window.LoadingConfig || {};
  const root = document.documentElement;

  if (cfg.accentHue != null)
    root.style.setProperty("--base-hue", String(cfg.accentHue));
  if (cfg.accentSaturation)
    root.style.setProperty("--saturation", cfg.accentSaturation);
  if (cfg.accentLightness)
    root.style.setProperty("--lightness", cfg.accentLightness);

  const serverNameEl = document.getElementById("server-name");
  const taglineEl = document.getElementById("tagline");
  const discordEl = document.getElementById("discord-link");

  if (serverNameEl) serverNameEl.textContent = cfg.serverName || "Server";
  if (taglineEl) taglineEl.textContent = cfg.tagline || "";
  if (discordEl) {
    if (cfg.discord) {
      discordEl.textContent = cfg.discord;
      discordEl.hidden = false;
    } else {
      discordEl.hidden = true;
    }
  }

  const video = document.getElementById("bg-video");
  const bgLayer = document.getElementById("bg-image");
  const glowLayer = document.querySelector(".bg-glows");
  const useGlow = cfg.useGlow !== false;
  const useVideo = !!cfg.useVideo;
  const useBackground = !!cfg.useBackground && !useVideo;

  if (glowLayer) glowLayer.hidden = !useGlow;
  if (bgLayer) bgLayer.hidden = !useBackground;
  document.body.classList.toggle("has-media-bg", useVideo || useBackground);

  if (video) {
    if (useVideo) {
      if (!video.getAttribute("src")) video.src = "video.mp4";
      video.hidden = false;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.hidden = true;
      if (video.getAttribute("src")) {
        video.removeAttribute("src");
        video.load();
      }
    }
  }

  const staffList = document.getElementById("staff-list");
  if (staffList && Array.isArray(cfg.staff)) {
    staffList.innerHTML = "";
    cfg.staff.forEach((member) => {
      const li = document.createElement("li");
      li.className = "staff-item";

      const avatar = document.createElement("div");
      avatar.className = "staff-avatar";

      if (member.image) {
        const img = document.createElement("img");
        img.src = member.image;
        img.alt = member.name || "";
        img.decoding = "async";
        img.loading = "lazy";
        img.onerror = () => {
          img.remove();
          avatar.textContent = initials(member.name);
        };
        avatar.appendChild(img);
      } else {
        avatar.textContent = initials(member.name);
      }

      const meta = document.createElement("div");
      meta.className = "staff-meta";
      meta.innerHTML =
        `<span class="staff-role">${escapeHtml(member.role || "")}</span>` +
        `<span class="staff-name">${escapeHtml(member.name || "")}</span>`;

      li.appendChild(avatar);
      li.appendChild(meta);
      staffList.appendChild(li);
    });
  }

  const rulesList = document.getElementById("rules-list");
  if (rulesList && Array.isArray(cfg.rules)) {
    rulesList.innerHTML = "";
    cfg.rules.forEach((rule) => {
      const li = document.createElement("li");
      li.className = "rule-item";
      li.textContent = rule;
      rulesList.appendChild(li);
    });
  }

  const panels = Array.from(document.querySelectorAll(".panel"));
  const layoutEl = document.querySelector(".layout");

  function equalizePanels() {
    if (panels.length < 2) return;

    panels.forEach((panel) => {
      panel.style.minHeight = "";
    });

    const contentHeight = Math.max(
      ...panels.map((panel) => panel.getBoundingClientRect().height),
    );
    const available = layoutEl ? layoutEl.clientHeight : contentHeight;
    const nextHeight = Math.floor(Math.min(contentHeight, available));

    if (nextHeight > 0) {
      panels.forEach((panel) => {
        panel.style.minHeight = `${nextHeight}px`;
      });
    }
  }

  equalizePanels();
  window.addEventListener("resize", equalizePanels);
  window.setTimeout(equalizePanels, 50);
  window.setTimeout(equalizePanels, 250);

  const tipEl = document.getElementById("tip-text");
  const tips =
    Array.isArray(cfg.tips) && cfg.tips.length ? cfg.tips : ["Loading…"];
  let tipIndex = 0;

  function showTip(index) {
    if (!tipEl) return;
    tipEl.classList.remove("is-visible");
    window.setTimeout(() => {
      tipEl.textContent = tips[index];
      tipEl.classList.add("is-visible");
    }, 220);
  }

  showTip(0);
  window.setInterval(() => {
    tipIndex = (tipIndex + 1) % tips.length;
    showTip(tipIndex);
  }, cfg.tipIntervalMs || 6000);

  const MUSIC_PREFS_KEY = "matti-loading-music";
  const audio = document.getElementById("loading-audio");
  const musicControls = document.getElementById("music-controls");
  const muteBtn = document.getElementById("mute-btn");
  const volumeSlider = document.getElementById("volume-slider");
  const musicHint = document.getElementById("music-hint");

  const musicEnabled = cfg.music?.enabled !== false;
  const prefs = loadMusicPrefs();
  let muted = typeof prefs.muted === "boolean" ? prefs.muted : false;
  let isPlaying = false;

  if (audio) {
    audio.src = cfg.music?.src || "music.mp3";
    const initialVolume = clamp(
      typeof prefs.volume === "number"
        ? prefs.volume
        : (cfg.music?.volume ?? 0.12),
      0,
      1,
    );
    audio.volume = initialVolume;
    if (volumeSlider) {
      volumeSlider.value = String(Math.round(initialVolume * 100));
      setVolumeTrack(initialVolume * 100);
    }

    if (musicEnabled) {
      if (!muted) {
        tryPlayMusic();
        document.addEventListener(
          "pointerdown",
          () => {
            if (!muted && !isPlaying) tryPlayMusic();
          },
          { once: true },
        );
      }
    } else if (musicControls) {
      musicControls.hidden = true;
    }
  }

  function tryPlayMusic() {
    if (!audio || !musicEnabled || muted) return;
    audio
      .play()
      .then(() => {
        isPlaying = true;
        updateMuteUi();
      })
      .catch(() => {
        isPlaying = false;
        updateMuteUi();
        if (musicHint) musicHint.textContent = "Click to start";
      });
  }

  function setMuted(nextMuted) {
    muted = nextMuted;
    if (!audio || !musicEnabled) return;

    if (muted) {
      audio.pause();
      isPlaying = false;
    } else {
      tryPlayMusic();
    }

    saveMusicPrefs({ muted, volume: audio.volume });
    updateMuteUi();
  }

  function setVolumeTrack(percent) {
    if (volumeSlider) {
      volumeSlider.style.setProperty(
        "--volume",
        `${clamp(Number(percent) || 0, 0, 100)}%`,
      );
    }
  }

  function updateMuteUi() {
    if (!muteBtn) return;
    muteBtn.classList.toggle("is-muted", muted);
    musicControls?.classList.toggle("is-muted", muted);
    muteBtn.setAttribute("aria-pressed", muted ? "true" : "false");
    muteBtn.title = muted ? "Unmute music" : "Mute music";
    if (musicHint) {
      musicHint.textContent = muted
        ? "Muted"
        : isPlaying
          ? "Playing"
          : "Click to start";
    }
  }

  muteBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    setMuted(!muted);
  });

  volumeSlider?.addEventListener("input", () => {
    if (!audio) return;
    const percent = Number(volumeSlider.value);
    audio.volume = clamp(percent / 100, 0, 1);
    setVolumeTrack(percent);
    saveMusicPrefs({ muted, volume: audio.volume });
    if (audio.volume > 0 && muted) setMuted(false);
  });

  updateMuteUi();

  function loadMusicPrefs() {
    try {
      return JSON.parse(localStorage.getItem(MUSIC_PREFS_KEY) || "{}") || {};
    } catch {
      return {};
    }
  }

  function saveMusicPrefs(next) {
    try {
      localStorage.setItem(MUSIC_PREFS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  const barFill = document.getElementById("progress-fill");
  const progressEl = document.querySelector(".progress");
  const percentEl = document.getElementById("progress-percent");
  const statusEl = document.getElementById("progress-status");

  let displayProgress = 0;
  let targetProgress = 0;
  let totalActions = 1;
  let mapActions = 0;
  let mapFinished = 0;

  const stageLabels = {
    INIT_BEFORE_MAP_LOADED: "Preparing map…",
    INIT_AFTER_MAP_LOADED: "Loading world…",
    INIT_SESSION: "Starting session…",
  };

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function setTarget(value) {
    targetProgress = clamp(value, 0, 100);
  }

  function renderProgress() {
    displayProgress += (targetProgress - displayProgress) * 0.12;
    if (Math.abs(targetProgress - displayProgress) < 0.05)
      displayProgress = targetProgress;

    const rounded = Math.round(displayProgress);
    if (barFill) barFill.style.width = `${displayProgress}%`;
    if (percentEl) percentEl.textContent = `${rounded}%`;
    if (progressEl) progressEl.setAttribute("aria-valuenow", String(rounded));
    requestAnimationFrame(renderProgress);
  }

  requestAnimationFrame(renderProgress);

  const handlers = {
    loadProgress(data) {
      if (typeof data.loadFraction === "number")
        setTarget(data.loadFraction * 100);
    },
    startInitFunctionOrder(data) {
      totalActions = Math.max(data.count || 1, 1);
      setStatus(stageLabels[data.type] || "Initializing…");
    },
    initFunctionInvoking(data) {
      const ratio = (data.idx || 0) / totalActions;
      const base =
        data.type === "INIT_SESSION"
          ? 70
          : data.type === "INIT_AFTER_MAP_LOADED"
            ? 40
            : 5;
      const span =
        data.type === "INIT_SESSION"
          ? 25
          : data.type === "INIT_AFTER_MAP_LOADED"
            ? 25
            : 30;
      setTarget(base + ratio * span);
      setStatus(stageLabels[data.type] || "Loading…");
    },
    startDataFileEntries(data) {
      mapActions = Math.max(data.count || 1, 1);
      mapFinished = 0;
      setStatus("Loading assets…");
    },
    performMapLoadFunction() {
      mapFinished += 1;
      setTarget(35 + (mapFinished / mapActions) * 30);
    },
    onLogLine(data) {
      if (data.message) setStatus(truncate(data.message, 64));
    },
  };

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data) return;
    if (data.eventName && handlers[data.eventName]) {
      handlers[data.eventName](data);
      return;
    }
    if (typeof data.loadFraction === "number") handlers.loadProgress(data);
  });

  let fallback = 0;
  const fallbackTimer = window.setInterval(() => {
    if (targetProgress >= 92) {
      window.clearInterval(fallbackTimer);
      return;
    }
    if (targetProgress < 8) {
      fallback = Math.min(fallback + 0.35, 8);
      setTarget(Math.max(targetProgress, fallback));
    }
  }, 400);

  function initials(name) {
    if (!name) return "?";
    return name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function truncate(value, max) {
    const str = String(value);
    return str.length > max ? `${str.slice(0, max - 1)}…` : str;
  }
})();
