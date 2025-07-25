const generateBtn = document.querySelector('.generate-btn');
const promptInput = document.getElementById('promptInput');
const imageContainer = document.getElementById('imageContainer');
const popup = document.getElementById('popup');

function showPopup(message) {
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => { popup.style.display = 'none'; }, 3000);
}

generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    showPopup("Please enter a prompt!");
    return;
  }

  imageContainer.innerHTML = `
    <div class="generating-box">
      <div class="sparkle">✨</div>
      <div class="generating-text">Generating ...</div>
      <div class="sparkle">✨</div>
    </div>
  `;

  try {
    const apiUrl = `https://death-image.ashlynn.workers.dev/?prompt=${encodeURIComponent(prompt)}&image=1&dimensions=square&safety=true`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.images && data.images.length > 0) {
      const imageUrl = data.images[0];
      imageContainer.innerHTML = `<img id="generatedImage" src="${imageUrl}" alt="Generated Image" />`;
      document.getElementById('downloadBtn').style.display = 'inline-block';
      return;
    } else {
      throw new Error("Primary API failed to return images.");
    }
  } catch (err) {
    console.warn("Primary API failed:", err.message);
  }

  try {
    const u = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large";
    const x = "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";

    const headers = {
      Authorization: `Bearer ${x}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await axios.post(u, { inputs: prompt }, { headers, responseType: "arraybuffer" });

    if (response.status === 200) {
      const base64 = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const imageUrl = `data:image/png;base64,${base64}`;
      imageContainer.innerHTML = `<img id="generatedImage" src="${imageUrl}" alt="Generated Image" />`;
      document.getElementById('downloadBtn').style.display = 'inline-block';
    } else {
      throw new Error("Fallback API failed.");
    }
  } catch (error) {
    console.error("Both APIs failed:", error);
    showPopup("Oops! Something went wrong. Please try again later.");
    imageContainer.innerHTML = "";
  }

  document.getElementById('downloadBtn').addEventListener('click', async () => {
  try {
    const image = document.getElementById('generatedImage');
    if (!image || !image.src) throw new Error("Image not found.");

    const img = new Image();
    img.crossOrigin = 'anonymous'; // works??
    img.src = image.src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'chikuai-image.png';
      link.click();
    };

    img.onerror = () => {
      alert("Can't download this image due to security policy.");
    };

  } catch (error) {
    console.error("Download failed:", error.message);
    alert("Download failed! Try after generating again.");
  }
});
});




