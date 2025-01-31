
const socket = io("https://ballistic-hip-value.glitch.me");
const messagesBox = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
let offer = "offer";
let ans = "answer";

let messages = [];

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("notification", (data) => {
  console.log("recieved notification:", data);
});

function sendMessage(type) {
  console.log("Sending message:", 'message');
  
    const message = { msg: '', me: true, type: type }
    
    socket.emit("send", message);
    messages.unshift();


}




const lc = new RTCPeerConnection();
const dc = lc.createDataChannel("channel");
dc.onmessage = (e) => console.log("msg: ", e.data);
dc.onopen = () => console.log("Data channel opened");

lc.onicecandidate = (e) => {
    if (e.candidate) {
        console.log("New ICE candidate: ", JSON.stringify(e.candidate));
    }
};

lc.createOffer()
    .then((offer) => lc.setLocalDescription(offer))
    .then(() => console.log("Local description set:", lc.localDescription))
    .catch((error) => console.error("Error creating offer:", error));



