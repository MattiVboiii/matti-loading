window.LoadingConfig = {
  serverName: "Your Server",
  tagline: "Welcome to the city",
  discord: "discord.gg/yourinvite",

  // Neon theme (HSL)
  accentHue: 24,
  accentSaturation: "95%",
  accentLightness: "52%",

  // Backdrop — glow is default; image/video are optional underlays
  useGlow: true,
  useBackground: false, // background.png under the glow
  useVideo: false, // video.mp4 under the glow (overrides image)

  music: {
    enabled: true,
    src: "music.mp3",
    volume: 0.12,
  },

  tips: [
    "Use the speaker button to mute music — your choice is remembered.",
    "Reports are handled through Discord tickets.",
    "Stay in character and respect other players.",
    "Use /report if you need staff assistance in-game.",
    "Read the rules before hopping into RP.",
  ],
  tipIntervalMs: 6000,

  staff: [{ name: "MattiVboiii", role: "Owner", image: "logo.png" }],

  rules: [
    "Stay in character and keep RP immersive.",
    "Respect every player and staff member.",
    "No RDM, VDM, or random deathmatching.",
    "Use common sense — if it ruins fun, don't do it.",
    "File reports in Discord, not in public chat.",
    "Do not metagame or powergame.",
  ],
};
