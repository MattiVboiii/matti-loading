-- Framework-agnostic loading screen shutdown.
-- Works with Qbox, QBCore, ESX, or no framework.
-- Safe to call even if another resource also shuts the loadscreen down later.

CreateThread(function()
	while not NetworkIsSessionStarted() do
		Wait(100)
	end

	ShutdownLoadingScreen()
	ShutdownLoadingScreenNui()
end)
