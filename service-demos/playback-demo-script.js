const data = {
    commands: [
        {
            "action": "goto",
            "args": [
                "https://chitchat.glitch.me"
            ]
        },
        {
            "action": "waitFor",
            "args": [
                "#num-clients:not(:empty)"
            ]
        },
        {
            "action": "type",
            "args": [
                "#message",
                "Hello world!"
            ]
        },
        {
            "action": "click",
            "args": [
                "#send"
            ]
        },
        {
            "action": "waitFor",
            "args": [
                ".message"
            ]
        }
    ]
};
fetch('http://localhost:3000/playback', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});
