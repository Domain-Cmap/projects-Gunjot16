// signin.js
export function signIn() {
  console.log("Sign In feature loaded.");
  const mapElement = document.getElementById("map");
  mapElement.innerHTML = `
      <form>
          <label for="username">Username:</label>
          <input type="text" id="username" name="username"><br>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password"><br>
          <button type="submit">Sign In</button>
      </form>
  `;
}
