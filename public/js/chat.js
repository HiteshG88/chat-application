const socket = io();

socket.on("message", (text) => {
  console.log(text);
});

const form = document.querySelector("#a");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.t1.value;

  //   console.log("form submitted!", message);
  socket.emit("formSubmit", message);
});

document.querySelector("#send-location").addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("GeoLocation not supported for your browser!");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    socket.emit("location", {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
    });
  });
});
