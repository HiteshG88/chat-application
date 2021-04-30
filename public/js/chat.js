const socket = io();

// Elements:
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (locationObj) => {
  const html = Mustache.render(locationTemplate, {
    url: locationObj.url,
    createdAt: moment(locationObj.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.t1.value;

  // second function is acknowledgement function. it will be called from server.
  socket.emit("formSubmit", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }
    console.log("message delivered!");
  });
});

$locationButton.addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("GeoLocation not supported for your browser!");
  }
  $locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    socket.emit(
      "location",
      {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      },
      () => {
        $locationButton.removeAttribute("disabled");
        console.log("location shared!");
      }
    );
  });
});
