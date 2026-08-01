# matti-loading

Standalone FiveM loading screen (no framework required). Works with Qbox, QBCore, ESX, or vanilla.

Includes accent glow, progress tracking, staff/rules panels, and persistent music controls.

## Install

1. Drop the resource in your `resources` folder
2. Add `ensure matti-loading` to `server.cfg`
3. Edit `config.js`

## Customize

Edit `config.js`:

- Server name, Discord, accent color, staff, rules, tips, music
- `useGlow` — CSS edge glow bound to `accentHue` (default on)
- `useBackground` — show `background.png` under the glow
- `useVideo` — show `video.mp4` under the glow (overrides image)

## Assets

- `logo.png`, `music.mp3`
- `background.png`, `video.mp4` (optional via config)

## Controls

- Speaker button — mute/unmute (saved across joins)
- Volume slider — also saved

## Notes

- Shuts itself down when the network session starts (`client.lua`)
- Compatible with multichar/spawn resources that also call `ShutdownLoadingScreen`
