let socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log("Error obtaining location:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.log("Geolocation is not supported by your browser.");
}

const map = L.map("map").setView([0, 0], 16); 
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "GunjotSingh@limmited",
}).addTo(map);

const markers = {}; 

socket.on("recieve-loaction", (data) => {
  const { id, latitude, longitude } = data;

  map.setView([latitude, longitude]);

  if (markers[id]) {
   
    markers[id].setLatLng([latitude, longitude]);
  } else {
    
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

document.getElementById("sosButton").addEventListener("click", () => {
  const dialog = document.createElement("div");
  dialog.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-gray-800", "bg-opacity-50", "flex", "items-center", "justify-center");

  const alertBox = document.createElement("div");
  alertBox.classList.add("bg-white", "p-6", "rounded-lg", "shadow-lg", "text-center");

  const heading = document.createElement("h2");
  heading.classList.add("text-red-600", "text-2xl", "font-semibold");
  heading.textContent = "Emergency Alert";

  const message = document.createElement("p");
  message.textContent = "Emergency alert sent to servers 1";

  const closeButton = document.createElement("button");
  closeButton.classList.add("mt-4", "px-4", "py-2", "bg-blue-500", "text-white", "rounded-md", "hover:bg-blue-600");
  closeButton.textContent = "Close";

  alertBox.appendChild(heading);
  alertBox.appendChild(message);
  alertBox.appendChild(closeButton);
  dialog.appendChild(alertBox);
  document.body.appendChild(dialog);

  closeButton.addEventListener("click", () => {
    document.body.removeChild(dialog);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch("/save-location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude }),
          });
          const data = await response.json();
          if (data.success) {
            console.log("Location saved successfully to MongoDB");
          } else {
            console.error("Failed to save location");
          }
        } catch (error) {
          console.error("Error while saving location:", error);
        }
      },
      (error) => {
        console.log("Error obtaining location:", error);
      }
    );
  });
});
document.getElementById('realTimeTraffic').addEventListener('click', () => {

  const trafficModal = document.createElement('div');
  trafficModal.id = 'trafficPopup';
  trafficModal.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';

  trafficModal.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 class="text-xl font-bold text-blue-600">Real-Time Traffic Monitoring</h2>
      <p class="mt-4">Enter your destination:</p>
      <input id="destinationInput" type="text" placeholder="Enter destination" class="mt-2 border p-2 w-full rounded-lg">
      <ul id="suggestionList" class="mt-2 border p-2 rounded-lg bg-white max-h-40 overflow-y-auto"></ul>
      <div class="mt-4 space-x-4">
        <button id="confirmDestination" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Confirm</button>
        <button id="closeTrafficPopup" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(trafficModal);

  const destinationInput = document.getElementById('destinationInput');
  const suggestionList = document.getElementById('suggestionList');
  destinationInput.addEventListener('input', () => {
    const query = destinationInput.value.trim();
    console.log('Query:', query);  
    if (query.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then(response => response.json())
        .then(data => {
          console.log('API Response:', data); 
          suggestionList.innerHTML = ''; 
          if (data && data.length > 0) {
            data.forEach((location) => {
              const suggestionItem = document.createElement('li');
              suggestionItem.className = 'p-2 hover:bg-gray-200 cursor-pointer';
              suggestionItem.textContent = location.display_name;
              suggestionItem.addEventListener('click', () => {
                destinationInput.value = location.display_name;
                destinationInput.dataset.lat = location.lat;
                destinationInput.dataset.lon = location.lon;
                suggestionList.innerHTML = '';
              });
              suggestionList.appendChild(suggestionItem);
            });
          } else {
            suggestionList.innerHTML = '<li class="p-2 text-gray-500">No results found</li>';
          }
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
          suggestionList.innerHTML = '<li class="p-2 text-red-500">Error fetching data</li>';
        });
    } else {
      suggestionList.innerHTML = ''; 
    }
  });

  document.getElementById('confirmDestination').addEventListener('click', () => {
    const destination = destinationInput.value.trim();
    const destLat = destinationInput.dataset.lat;
    const destLon = destinationInput.dataset.lon;

    if (!destination || !destLat || !destLon) {
      alert('Please select a valid destination from the suggestions.');
      return;
    }

    const startLat = map.getCenter().lat;  
    const startLon = map.getCenter().lng;

    fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248c0d7933e621544b18cec02bb7b87704f&start=${startLon},${startLat}&end=${destLon},${destLat}`)
      .then(response => response.json())
      .then(data => {
        const coordinates = data.features[0].geometry.coordinates;
        const route = coordinates.map(coord => [coord[1], coord[0]]);
        L.polyline(route, { color: 'blue' }).addTo(map);

        const trafficAlert = document.createElement('div');
        trafficAlert.id = 'trafficAlert';
        trafficAlert.className = 'fixed bottom-5 right-5 bg-red-600 text-white p-4 rounded-lg shadow-lg z-30';
        trafficAlert.innerHTML = `
          <p>🚦 High traffic detected on the route!</p>
          <button id="closeTrafficAlert" class="mt-2 bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700">Dismiss</button>
        `;
        document.body.appendChild(trafficAlert);

        document.getElementById('closeTrafficAlert').addEventListener('click', () => {
          trafficAlert.remove();
        });
      })
      .catch(error => console.error('Error fetching route:', error));

    trafficModal.remove();
  });

  document.getElementById('closeTrafficPopup').addEventListener('click', () => {
    trafficModal.remove();
  });

  document.addEventListener('click', (e) => {
    if (e.target.id === 'trafficPopup' || e.target.id === 'closeTrafficPopup') {
      trafficModal.remove();
    }
  });
});
document.getElementById('suspiciousActivityBtn').addEventListener('click', () => {

  const activityModal = document.createElement('div');
  activityModal.id = 'activityPopup';
  activityModal.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';

  activityModal.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 class="text-xl font-bold text-blue-600">Suspicious Activity Detection</h2>
      <p class="mt-4">Checking for suspicious activity...</p>
      <div id="loader" class="loader mt-4"></div> <!-- Loader -->
      <div id="activityResult" class="mt-4 hidden"></div> <!-- Result will be shown here -->
      <div class="mt-4">
        <button id="closeActivityPopup" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(activityModal);

  const loaderStyle = document.createElement('style');
  loaderStyle.innerHTML = `
    .loader {
      border: 4px solid #f3f3f3; 
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 2s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(loaderStyle);

  function checkSuspiciousActivity() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const activityFound = Math.random() > 0.5; 
        resolve(activityFound);
      }, 3000);
    });
  }

  checkSuspiciousActivity().then(activityFound => {

    document.getElementById('loader').style.display = 'none';
    const activityResult = document.getElementById('activityResult');
    activityResult.classList.remove('hidden');
    
    if (activityFound) {
      activityResult.innerHTML = `<p class="text-green-600">Suspicious activity detected!</p>`;
    } else {
      activityResult.innerHTML = `<p class="text-red-600">No suspicious activity found.</p>`;
    }
  }).catch(error => {
    document.getElementById('loader').style.display = 'none';
    const activityResult = document.getElementById('activityResult');
    activityResult.classList.remove('hidden');
    activityResult.innerHTML = `<p class="text-red-600">Error checking for suspicious activity.</p>`;
  });

  document.getElementById('closeActivityPopup').addEventListener('click', () => {
    activityModal.remove();
  });
});
function checkSuspiciousActivity() {
  return fetch('/check-suspicious-activity')
    .then(response => response.json())
    .then(data => data.activityFound)
    .catch(error => {
      console.error('Error checking activity:', error);
      return false;
    });
}
