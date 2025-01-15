// home.js
export function loadHome() {
  console.log("Home feature loaded.");
  const mapElement = document.getElementById("map");
  mapElement.innerHTML = "<p>Welcome to the Traffic Surveillance System!</p>";
}
