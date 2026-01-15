// script.js

// Function to process the uploaded file for encryption or decryption
function processFile(action) {
    const fileInput = document.getElementById('fileInput');
    const key = document.getElementById('key').value;

    // Validate key input
    if (!isValidKey(key)) {
        return; // Alert message handled in isValidKey
    }

    // Check if a file has been uploaded
    if (!fileInput.files.length) {
        alert("Please upload a file.");
        return;
    }

    const file = fileInput.files[0];

    // Validate file type
    if (!file.name.endsWith('.txt')) {
        alert("Please upload a valid text file (.txt).");
        return;
    }

    const reader = new FileReader();

    // When the file has been read
    reader.onload = function(event) {
        const fileText = event.target.result; // Get the content of the file
        let resultText;

        // Process the text based on the action (encrypt or decrypt)
        if (action === 'encrypt') {
            resultText = encrypt(fileText, key);
        } else if (action === 'decrypt') {
            resultText = decrypt(fileText, key);
        }

        // Create a Blob with the result text for download
        const blob = new Blob([resultText], { type: 'text/plain' });
        const downloadLink = document.getElementById('downloadLink');

        // Set the download link's href to the Blob URL
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${action}_result.txt`; // Set the filename for the download
        downloadLink.style.display = 'block'; // Show the download link
        downloadLink.innerText = `Download ${action === 'encrypt' ? 'Encrypted' : 'Decrypted'} Result`;
    };

    // Read the file as text
    reader.readAsText(file);
}

// Function to check if the key is valid
function isValidKey(key) {
    if (!/^[a-zA-Z]+$/.test(key)) {
        alert("Invalid key. The key must only contain alphabetic characters (no numbers or symbols).");
        return false;
    }
    if (key.length < 5 || key.length > 16) {
        alert("Invalid key length. The key must be between 5 and 16 characters long.");
        return false;
    }
    return true; // Key is valid
}

// Function to encrypt the plaintext using the given key
function encrypt(plaintext, key) {
    let encrypt = '';
    plaintext = plaintext.toLowerCase();
    key = key.toLowerCase();
    const theKey = KeyReapetion(key, plaintext.length);
    let keyIndex = 0;

    for (let c = 0; c < plaintext.length; c++) {
        const plainTextLetter = plaintext.charAt(c);

        if (plainTextLetter >= 'a' && plainTextLetter <= 'z') { // Only encrypt letters
            const keyLetter = theKey.charAt(keyIndex);
            const newLetterValue = plainTextLetter.charCodeAt(0) - 'a'.charCodeAt(0);
            const newKeyValue = keyLetter.charCodeAt(0) - 'a'.charCodeAt(0);
            let result = newLetterValue + newKeyValue;

            if (result >= 26) {
                result = result % 26; // Wrap around if greater than 25
            }

            const encryptedLetter = String.fromCharCode(result + 'A'.charCodeAt(0));
            encrypt += encryptedLetter; // Append encrypted letter
            keyIndex++;
        } else {
            encrypt += plainTextLetter; // Append non-letter characters unchanged
        }
    }
    return encrypt;
}

// Function to repeat the key to match the plaintext length
function KeyReapetion(key, plainTextLength) {
    let KR = '';
    for (let i = 0; i < plainTextLength; i++) {
        KR += key.charAt(i % key.length); // Repeat key in a circular manner
    }
    return KR;
}

// Function to decrypt the crypted text using the given key
function decrypt(cryptedText, key) {
    let decrypt = '';
    cryptedText = cryptedText.toLowerCase();
    key = key.toLowerCase();
    const theKey = KeyReapetion(key, cryptedText.length);
    let keyIndex = 0;

    for (let c = 0; c < cryptedText.length; c++) {
        const plainTextLetter = cryptedText.charAt(c);

        if (plainTextLetter >= 'a' && plainTextLetter <= 'z') { // Only decrypt letters
            const keyLetter = theKey.charAt(keyIndex);
            const newLetterValue = plainTextLetter.charCodeAt(0) - 'a'.charCodeAt(0);
            const newKeyValue = keyLetter.charCodeAt(0) - 'a'.charCodeAt(0);
            let result = newLetterValue - newKeyValue;

            if (result < 0) {
                result = (result + 26) % 26; // Wrap around if negative
            }

            const decryptedLetter = String.fromCharCode(result + 'a'.charCodeAt(0));
            decrypt += decryptedLetter; // Append decrypted letter
            keyIndex++;
        } else {
            decrypt += plainTextLetter; // Append non-letter characters unchanged
        }
    }
    return decrypt;
}

// Listen for radio selection
const radios = document.querySelectorAll('input[name="action"]');

radios.forEach(radio => {
    radio.addEventListener('change', () => {
        const action = document.querySelector('input[name="action"]:checked')?.value;
        if (!action) return;

        // Only run if file & key exist
        const fileInput = document.getElementById('fileInput');
        const key = document.getElementById('key').value;

        if (!fileInput.files.length || !key) return;

        processFile(action);
    });
});


// Function to show a specific pop-up
function showPopup(popupId) {
    document.getElementById(popupId).style.display = "flex";
}

// Function to close a specific pop-up
function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
}

// Close pop-up when clicking outside of it
window.addEventListener("click", function (event) {
    let popups = document.querySelectorAll(".popup");
    popups.forEach(popup => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});

const lines = document.querySelectorAll('#back-ani .onze');

function flickerGlow() {
  lines.forEach(line => {
    const chars = line.textContent.split('');

    // remove previous glow
    line.innerHTML = chars.map(c => `<span class="onze">${c}</span>`).join('');

    // pick 5 new random positions to glow
    const glowIndexes = [];
    while (glowIndexes.length < 5) {
      const pos = Math.floor(Math.random() * chars.length);
      if (!glowIndexes.includes(pos)) glowIndexes.push(pos);
    }

    // add glow to selected characters
    const newHTML = chars.map((c, i) => {
      if (glowIndexes.includes(i)) {
        return `<span class="onze" id="glow">${c}</span>`;
      } else {
        return `<span class="onze">${c}</span>`;
      }
    }).join('');

    line.innerHTML = newHTML;
  });
}

// start the flicker loop
setInterval(flickerGlow, 800);