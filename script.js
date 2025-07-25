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
      const x = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large";
      const y = "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";

      const headers = {
        Authorization: `Bearer ${y}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      };

      const response = await axios.post(x, { inputs: prompt }, { headers, responseType: "arraybuffer" });

      if (response.status === 200) {
        const base64 = btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const imageUrl = `data:image/png;base64,${base64}`;
        imageContainer.innerHTML = `<img src="${imageUrl}" alt="Generated Image" />`;
      } else {
        throw new Error("hugging API failed.");
      }
    } catch (error) {
      console.error("hugging API failed:", error);
      showPopup("Oops! Something went wrong. Please try again later.");
      imageContainer.innerHTML = "";
    }
    
    try {
      const apiUrl = `https://death-image.ashlynn.workers.dev/?prompt=${encodeURIComponent(prompt)}&image=1&dimensions=square&safety=true`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.images && data.images.length > 0) {
        imageContainer.innerHTML = `<img src="${data.images[0]}" alt="Generated Image" />`;
        return;
      } else {
        throw new Error(" API failed to return image.");
      }
    } catch (err) {
      console.warn(" API failed:", err.message);
    }

    
  });




