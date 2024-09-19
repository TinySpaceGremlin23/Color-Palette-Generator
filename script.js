document.addEventListener("DOMContentLoaded", function() {
  // Handle form submission for user-defined palette generation
  document.getElementById("colorForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById("name").value;
    const paletteSize = document.getElementById("palette-size").value;

    // Generate a color palette based on user input
    const palette = generateColorPalette(name, paletteSize);

    // Display the palette and show action buttons
    displayPalette(palette);
    showActionButtons(palette);
  });

  // Randomize Palette Button: Generates a random palette with user-defined size
  document.getElementById("randomizeButton").addEventListener("click", function() {
    const randomPaletteSize = document.getElementById("random-palette-size").value || 5; // Default size if input is empty

    if (randomPaletteSize < 4 || randomPaletteSize > 16) {
      alert("Please enter a size between 4 and 16.");
      return;
    }

    const randomPalette = generateRandomColorPalette(randomPaletteSize);

    // Display the random palette and show action buttons
    displayPalette(randomPalette);
    showActionButtons(randomPalette);
  });
});

// Generate a color palette based on the user's name and palette size
function generateColorPalette(name, size) {
  let colors = [];
  
  for (let i = 0; i < size; i++) {
    let seed = name.charCodeAt(i % name.length) + i * 16;
    let r = (seed * 123) % 256;
    let g = (seed * 456) % 256;
    let b = (seed * 789) % 256;
    let color = `rgb(${r}, ${g}, ${b})`;
    colors.push(color);
  }
  
  return colors;
}

// Generate a random color palette of given size
function generateRandomColorPalette(size) {
  let colors = [];
  
  for (let i = 0; i < size; i++) {
    let r = getRandomInt(0, 255);
    let g = getRandomInt(0, 255);
    let b = getRandomInt(0, 255);
    let color = `rgb(${r}, ${g}, ${b})`;
    colors.push(color);
  }
  
  return colors;
}

// Display the generated color palette on the page
function displayPalette(colors) {
  const container = document.getElementById("paletteContainer");
  container.innerHTML = ""; // Clear previous palette
  
  colors.forEach(color => {
    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = color;
    colorDiv.className = "colorBox";
    container.appendChild(colorDiv);
  });
}

// Show action buttons (Copy, Save, Share, Export)
function showActionButtons(palette) {
  document.getElementById("buttonsContainer").style.display = "inline";

  // Attach button functionality (copy, save, share, export)
  document.getElementById("copyButton").onclick = function() {
    copyPaletteToClipboard(palette);
  };

  document.getElementById("saveButton").onclick = function() {
    savePaletteToLocal(palette);
  };

  document.getElementById("shareButton").onclick = function() {
    sharePalette(palette);
  };

  document.getElementById("exportJSONButton").onclick = function() {
    exportPaletteAsJSON(palette);
  };

  document.getElementById("exportImageButton").onclick = function() {
    exportPaletteAsImage(palette);
  };
}

// Copy palette to clipboard
function copyPaletteToClipboard(colors) {
  const paletteString = colors.join('\n');
  
  navigator.clipboard.writeText(paletteString).then(() => {
    alert('Color palette copied to clipboard!');
  }).catch(err => {
    alert('Failed to copy palette: ' + err);
  });
}

// Save the palette locally
function savePaletteToLocal(palette) {
  const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || [];
  savedPalettes.push(palette);
  localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
  alert("Palette saved successfully!");
}

// Share palette via Web Share API
function sharePalette(palette) {
  const paletteString = palette.join(', ');

  if (navigator.share) {
    navigator.share({
      title: 'Check out my color palette!',
      text: `Here’s a color palette I generated: ${paletteString}`,
      url: window.location.href
    }).then(() => {
      console.log('Thanks for sharing!');
    }).catch((err) => {
      console.error('Error sharing:', err);
    });
  } else {
    alert('Sharing is not supported on this browser.');
  }
}

// Export palette as JSON
function exportPaletteAsJSON(palette) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(palette));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "palette.json");
  downloadAnchor.click();
}

// Export palette as an image with watermark
function exportPaletteAsImage(palette) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Canvas size adjusted to accommodate watermark
  const colorBoxHeight = 50;
  const canvasWidth = 300;
  const canvasHeight = colorBoxHeight + 40; // Extra height for watermark
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Draw the color palette on the canvas
  palette.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i * (canvas.width / palette.length), 0, canvas.width / palette.length, colorBoxHeight);
  });

  // Add watermark image
  const watermark = new Image();
  watermark.src = 'images/TSG-Watermark.gif'; 
  
  // Once watermark is loaded, draw it on the canvas
  watermark.onload = function() {
    const watermarkWidth = 270; // Set the width for watermark
    const watermarkHeight = 35; // Set the height for watermark
    const xPosition = canvas.width - watermarkWidth - 10; // Right bottom corner
    const yPosition = canvas.height - watermarkHeight - 5; // Slight padding from the bottom
    
    // Set the watermark transparency (optional)
    ctx.globalAlpha = 0.5; // Adjust transparency (0 is fully transparent, 1 is fully opaque)
    ctx.drawImage(watermark, xPosition, yPosition, watermarkWidth, watermarkHeight);
    
    // After watermark is added, export the image
    const link = document.createElement('a');
    link.href = canvas.toDataURL("image/png");
    link.download = "palette_with_watermark.png";
    link.click();
  };

  // In case the watermark image doesn't load (for fallback purposes)
  watermark.onerror = function() {
    alert('Failed to load watermark.');
  };
}

// Utility function to generate a random integer between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
