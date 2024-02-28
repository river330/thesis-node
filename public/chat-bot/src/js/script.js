export let convoContent = [];

let chatHistory = [{role: "system", content: "You are a helpful assistant."}];

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
    console.log("added question");

    changeRed();
    scrollToBottom();

    let forChatHistory = {role: "user", content: prompt};
    chatHistory.push(forChatHistory);

    fetch('/api/openai/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-4-0125-preview",
            messages: chatHistory,
            temperature: 1,
            max_tokens: 300
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

        let forChatHistory2 = {role: "assistant", content: data.choices[0].message.content};

        chatHistory.push(forChatHistory2);

        console.log(chatHistory)

        changeGreen();
        scrollToBottom();

    })
    .catch(error => console.error('Error:', error))
});

function changeRed() {
    var targetWord = "HUMAN:"; // The word you're searching for
    $(".conversationContainer p").each(function() {
        var regex = new RegExp('('+ targetWord +')', 'gi');
        $(this).html($(this).html().replace(regex, '<span class="red">$1</span>'));
    });

}

function changeGreen() {
    var targetWord ="CHATGPT:";
    $(".conversationContainer p").each(function() {
        var regex = new RegExp('('+ targetWord +')', 'gi');
        $(this).html($(this).html().replace(regex, '<span class="green">$1</span>'));
    });
   

}

import { generatePDF } from "./print.js";
window.generatePDF = generatePDF;

function scrollToBottom() {
    var $container = $('.conversationContainer');
    var scrollHeight = $container.prop('scrollHeight');
    $container.animate({
        scrollTop: scrollHeight
    }, 500); // Adjust the duration (500ms) as needed
};

$(document).ready(function() {
    $('#promptInput').keypress(function(event) {
        if (event.which == 13) { // 13 is the Enter key
            event.preventDefault(); // Prevent the default action to stop submitting the form
            $('#promptSubmit').click(); // Trigger the click event on your submit button
        }
    });
});