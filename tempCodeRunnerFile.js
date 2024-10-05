const animatescore = (scoreElement) => {
  scoreElement.style.transform = "scale(2";
  setTimeout(() => {
    scoreElement.style.transform  = "scale(1)";
  }, 300);
}