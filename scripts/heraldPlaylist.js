Hooks.on("canvasReady", async () => {
  if (canvas.scene.active == true) {
  } else {
  }
});

function heraldPlaylist_renderButton() {
  const existingBar = document.getElementById("heraldPlaylist");
  if (existingBar) {
    existingBar.remove();
  }

  fetch(
    "/modules/herald-playlist-beta/templates/heraldPlaylist-playlistButton.html"
  )
    .then((response) => response.text())
    .then((html) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      const playlist = div.firstChild;
      playlist.id = "heraldPlaylist";

      const playlistButton = document.createElement("button");
      playlistButton.id = "heraldPlaylist-playlistButton";
      playlistButton.classList.add("heraldPlaylist-playlistButton");
      playlistButton.textContent = "🎵";
      playlistButton.addEventListener("click", function () {
        heraldPlaylist_dialogPlaylist();
      });

      console.log("jalan");
      playlist.appendChild(playlistButton);
      document.body.appendChild(playlist);
    })
    .catch((err) => {
      console.error("Gagal memuat template playlist.html:", err);
    });
}

function heraldPlaylist_dialogPlaylist() {
  const globalSettings = {
    musicVolume: game.settings.get("core", "globalPlaylistVolume"),
    ambientVolume: game.settings.get("core", "globalAmbientVolume"),
    interfaceVolume: game.settings.get("core", "globalInterfaceVolume"),
  };

  const content = `
  <form>
    <div class="heraldPlaylist-formGrup">
      <label for="heraldPlaylist-music-volume">Music Volume: <span id="heraldPlaylist-music-volume-value">${(
        globalSettings.musicVolume * 100
      ).toFixed(0)}%</span></label>
      <div class="heraldPlaylist-volumeControl">
        <input type="range" id="heraldPlaylist-music-volume" name="musicVolume" min="0" max="1" step="0.01" value="${
          globalSettings.musicVolume
        }">
        <input type="number" id="heraldPlaylist-music-volume-input" value="${(
          globalSettings.musicVolume * 100
        ).toFixed(0)}" min="0" max="100" step="1">
      </div>
    </div>
    <div class="heraldPlaylist-formGrup">
      <label for="heraldPlaylist-ambient-volume">Ambient Volume: <span id="heraldPlaylist-ambient-volume-value">${(
        globalSettings.ambientVolume * 100
      ).toFixed(0)}%</span></label>
      <div class="heraldPlaylist-volumeControl">
        <input type="range" id="heraldPlaylist-ambient-volume" name="ambientVolume" min="0" max="1" step="0.01" value="${
          globalSettings.ambientVolume
        }">
        <input type="number" id="heraldPlaylist-ambient-volume-input" value="${(
          globalSettings.ambientVolume * 100
        ).toFixed(0)}" min="0" max="100" step="1">
      </div>
    </div>
    <div class="heraldPlaylist-formGrup">
      <label for="heraldPlaylist-interface-volume">Interface Volume: <span id="heraldPlaylist-interface-volume-value">${(
        globalSettings.interfaceVolume * 100
      ).toFixed(0)}%</span></label>
      <div class="heraldPlaylist-volumeControl">
        <input type="range" id="heraldPlaylist-interface-volume" name="interfaceVolume" min="0" max="1" step="0.01" value="${
          globalSettings.interfaceVolume
        }">
        <input type="number" id="heraldPlaylist-interface-volume-input" value="${(
          globalSettings.interfaceVolume * 100
        ).toFixed(0)}" min="0" max="100" step="1">
      </div>
    </div>
  </form>
`;

  new Dialog({
    title: "Volume Settings",
    content: content,
    buttons: {
      save: {
        label: "Save",
        callback: (html) => {
          const musicVolume = parseFloat(
            html.find("#heraldPlaylist-music-volume").val()
          );
          const ambientVolume = parseFloat(
            html.find("#heraldPlaylist-ambient-volume").val()
          );
          const interfaceVolume = parseFloat(
            html.find("#heraldPlaylist-interface-volume").val()
          );

          game.settings.set("core", "globalPlaylistVolume", musicVolume);
          game.settings.set("core", "globalAmbientVolume", ambientVolume);
          game.settings.set("core", "globalInterfaceVolume", interfaceVolume);
          ui.notifications.info("Volume settings updated.");
        },
      },
      cancel: {
        label: "Cancel",
      },
    },
    render: (html) => {
      html.find("input[type=range]").on("input", function () {
        const volumeValue = (parseFloat(this.value) * 100).toFixed(0);
        html.find(`#${this.id}-value`).text(`${volumeValue}%`);
        const inputId = this.id.replace("-volume", "-volume-input");
        html.find(`#${inputId}`).val(volumeValue);
      });

      html.find("input[type=number]").on("input", function () {
        const volumeValue = parseFloat(this.value);
        if (volumeValue >= 0 && volumeValue <= 100) {
          const sliderId = this.id.replace("-input", "");
          const normalizedValue = volumeValue / 100;
          html.find(`#${sliderId}`).val(normalizedValue);
          html.find(`#${sliderId}`).trigger("input");
        }
      });
    },
  }).render(true);
}

export { heraldPlaylist_renderButton };
