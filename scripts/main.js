import * as herald_playlist from "./heraldPlaylist.js";

Hooks.on("ready", () => {
  setTimeout(() => {
    herald_playlist.heraldPlaylist_renderButton();
  }, 1000);
});
