const video = document.getElementById("video");

async function startDetection() {

  // Start camera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      video.play(); 
    })
    .catch(err => {
      alert("Camera error 😢");
    });

  // Load models
  await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
  await faceapi.nets.faceExpressionNet.loadFromUri('./models');

  // 🔥 REMOVE video.addEventListener('play')
  // 🔥 DIRECTLY START DETECTION LOOP

  setInterval(async () => {

    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.3 })
    ).withFaceExpressions();

    if (detections.length > 0) {

      const expressions = detections[0].expressions;

      const emotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      document.getElementById("emotion").innerText =
        "Emotion: " + emotion;

      showRecommendations(emotion);
    }

  }, 2000);
}

function showRecommendations(emotion) {

  const recDiv = document.getElementById("recommendations");

  let content = "";

  if (emotion === "happy") {
    content = "<h3>🎉 Try K-pop & Comedy Anime</h3>";
  }
  const video = document.getElementById("video");

async function startDetection() {

  // Start camera first
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      alert("Camera error 😢");
    });

  // Load AI models
  await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
  alert("Model 1 loaded");

  await faceapi.nets.faceExpressionNet.loadFromUri('./models');
  alert("Model 2 loaded");



  video.addEventListener('play', () => {
    setInterval(async () => {

      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceExpressions();

      if (detections.length > 0) {

        const expressions = detections[0].expressions;

        const emotion = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        document.getElementById("emotion").innerText =
          "Emotion: " + emotion;

        showRecommendations(emotion);
      }

    }, 2000);
  });
}

function showRecommendations(emotion) {

  const recDiv = document.getElementById("recommendations");

  let content = "";

  if (emotion === "happy") {
    content = `
      <h3>🎉 You seem Happy!</h3>
      <p>Try: K-pop songs, Comedy anime</p>
    `;
  }
  else if (emotion === "sad") {
    content = `
      <h3>💖 Feeling Sad?</h3>
      <p>Watch: Emotional K-dramas</p>
    `;
  }
  else if (emotion === "angry") {
    content = `
      <h3>🔥 Feeling Angry?</h3>
      <p>Watch: Action anime & thrillers</p>
    `;
  }
  else {
    content = `
      <h3>✨ Neutral Mood</h3>
      <p>Here are trending picks</p>
    `;
  }

  recDiv.innerHTML = content;
}}