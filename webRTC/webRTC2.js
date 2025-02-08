const socket = io("https://ballistic-hip-value.glitch.me");

// Create a WebRTC connection
const lc = new RTCPeerConnection();
const dc = lc.createDataChannel("channel");

dc.onmessage = (e) => console.log("Message received:", e.data);
dc.onopen = () => console.log("Data channel opened");

// Handle ICE candidates
lc.onicecandidate = (e) => {
    if (e.candidate) {
        console.log("New ICE candidate:", JSON.stringify(e.candidate));
        socket.emit("send", { type: "ice-candidate", data: e.candidate });
    }
};

// Function triggered by the button
function test() {
    console.log("Button clicked! Creating offer...");

    lc.createOffer()
        .then((offer) => lc.setLocalDescription(offer))
        .then(() => {
            console.log("Sending offer:", lc.localDescription);
            socket.emit("send", { type: "offer", data: lc.localDescription });
        })
        .catch((error) => console.error("Error creating offer:", error));
}

// Handle all incoming messages
socket.on("notification", async (msg) => {
    // console.log("Received message:", msg);

    if (msg.type === "offer") {
        // console.log("Processing offer...");
        await lc.setRemoteDescription(new RTCSessionDescription(msg.data));

        const answer = await lc.createAnswer();
        await lc.setLocalDescription(answer);

        // console.log("Sending answer...");
        socket.emit("send", { type: "answer", data: answer });
    } 
    
    else if (msg.type === "answer") {
        // console.log("Processing answer...");
        await lc.setRemoteDescription(new RTCSessionDescription(msg.data));
    } 
    
    else if (msg.type === "ice-candidate") {
        try {
            await lc.addIceCandidate(new RTCIceCandidate(msg.data));
            // console.log("Added ICE candidate:", msg.data);
        } catch (error) {
            console.error("Error adding ICE candidate:", error);
        }
    }
});



