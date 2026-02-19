document.addEventListener("DOMContentLoaded", () => {

 
  const colorForm = document.getElementById("colorForm");
  if (colorForm) {
    colorForm.addEventListener("submit", event => {
      event.preventDefault();

      const name = document.getElementById("userInput").value;
      const size = parseInt(document.getElementById("userSize").value, 10);

      const palette = generateColorPalette(name, size);

      displayPalette(palette);
      showActionButtons(palette);
    });
  }

 
  const mainActionBtn = document.getElementById("mainActionBtn");
  const circularMenu = document.getElementById("circularMenu");

  if (mainActionBtn && circularMenu) {
    mainActionBtn.addEventListener("click", () => {
      circularMenu.classList.toggle("active");
    });
  }

 


  const toggleBtn = document.getElementById("toggleBtn");
  const sidebar = document.getElementById("sidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", event => {
      event.stopPropagation();
      sidebar.classList.toggle("active");
    });

    document.addEventListener("click", event => {
      if (!sidebar.contains(event.target) && event.target !== toggleBtn) {
        sidebar.classList.remove("active");
      }
    });
  }
});



function generateColorPalette(name, size) {
  let colors = [];

  for (let i = 0; i < size; i++) {
    let seed = name.charCodeAt(i % name.length) + i * 72;
    let r = (seed * 123) % 256;
    let g = (seed * 456) % 256;
    let b = (seed * 789) % 256;
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }

  return colors;
}

function displayPalette(colors) {
  const container = document.getElementById("colorContain");
  if (!container) return; // prevents errors on About page

  container.innerHTML = "";

  colors.forEach(color => {
    const div = document.createElement("div");
    div.className = "colorBox";
    div.style.backgroundColor = color;
    container.appendChild(div);
  });
}

function showActionButtons(palette) {
  const menu = document.getElementById("circularMenu");
  if (!menu) return; // prevents errors on About page

  menu.style.display = "block";

  document.getElementById("copyAction").onclick = () => copyPaletteToClipboard(palette);
  document.getElementById("saveAction").onclick = () => savePaletteToLocal(palette);
  document.getElementById("shareAction").onclick = () => sharePalette(palette);

  const watermark = document.getElementById("watermark");
  if (watermark) watermark.style.display = "block";
}



function copyPaletteToClipboard(palette) {
  navigator.clipboard.writeText(palette.join(", "))
    .then(() => alert("Palette copied. Paste it where you please!"));
}

function savePaletteToLocal(palette) {
  localStorage.setItem("savedPalette", JSON.stringify(palette));
  alert("Palette saved! When was it ever in trouble?");
}

function sharePalette(palette) {
  const text = `Check out this color combo! ${palette.join(", ")}`;
  navigator.share
    ? navigator.share({ text })
    : alert("Sharing not supported on this device.");
}





