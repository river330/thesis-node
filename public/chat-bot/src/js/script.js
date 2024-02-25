export let convoContent = [];

document.getElementById('promptForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    const prompt = document.getElementById('promptInput').value;

    let container = document.querySelector(".conversationContainer");
    let newText = document.createElement("p");
    let fullText = "HUMAN: " + prompt;
            
    let forPDF = ["HUMAN:", prompt]
    convoContent.push(forPDF);
    let newNode = document.createTextNode(fullText);
    newText.appendChild(newNode);

    container.appendChild(newText);
    console.log("added question")

    fetch('/api/openai/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 150
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let newText2 = document.createElement("p");
        let fullText2 = "CHATGPT: " + data.choices[0].message.content;

        let forPDF2 = ["CHATGPT:", data.choices[0].message.content]
        convoContent.push(forPDF2);
        let newNode2 = document.createTextNode(fullText2);
        newText2.appendChild(newNode2);

        container.appendChild(newText2);

        document.getElementById('promptInput').value = '',
        console.log("added response");
    })
    .catch(error => console.error('Error:', error))
});

import { generatePDF } from "./print.js";
window.generatePDF = generatePDF;