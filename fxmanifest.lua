fx_version("cerulean")
game({ "gta5" })

author("MattiVboiii")
description("Standalone cinematic loadingscreen with progress, music controls, and config-driven content")
version("1.1.0")

loadscreen("index.html")
loadscreen_cursor("yes")
loadscreen_manual_shutdown("yes")

client_script("client.lua")

files({
	"index.html",
	"style.css",
	"config.js",
	"script.js",
	"music.mp3",
	"logo.png",
	"background.png",
	"video.mp4",
})
