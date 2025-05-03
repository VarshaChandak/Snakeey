🐍 Snake Game — Vanilla JS Edition
A modern, visually enhanced version of the classic Snake Game, built using HTML5 Canvas and pure JavaScript—no libraries or frameworks involved.
🚀 Features
Smooth animations and controls

Self-collision and wall wrapping logic

Dynamic food spawning with vibrant color effects

Particle splash animation on eating food

Score tracking and persistent high score via localStorage

Fully responsive 400x400 grid game board

🖥️ Demo
Press Arrow Keys to control the snake.
Click Replay to restart the game after a collision.

📁 Setup & Run
Clone or download this repository.

Ensure the folder has both snake.js and this index.html:

html
Copy
Edit
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Snake Game</title>
</head>
<body>
  <div id="controls">
    Score: <span id="score">00</span>
    <button id="replay">Replay</button>
  </div>
  <div id="canvas"></div>
  <script src="snake.js"></script>
</body>
</html>
Open index.html in your browser.

Optional: Run a local server
For best compatibility, especially with localStorage:

bash
Copy
Edit
# Python 3
python -m http.server 8000

# Or use Node.js http-server
npm install -g http-server
http-server
Then go to http://localhost:8000.

📦 Commit Structure
The code is structured with 20 progressive commits:

🧱 Canvas Initialization

🐍 Snake Movement & Collision

🍎 Food & Particle Effects

🎮 Input Controls

🏁 Game Over Handling

💾 High Score Persistence

🎨 Final polish and visual tuning

