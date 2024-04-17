export let convoContent = []; //runing conversations being logged
export let playerInfo = {
    name: '',
    title: '',
}

//an array of the running chatHistory being using as context for the GPT
let chatHistory = [{role: "system", content: "You are a helpful assistant."}];

//what happens on click "Print Conversation"
document.getElementById('promptForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    const prompt = document.getElementById('promptInput').value; //gathers what is in the prompt section

    //the conversation container
    let container = document.querySelector(".conversationContainer");

    //creating a new text element
    let newText = document.createElement("p");

    //composes the user prompt with 'HUMAN: ' in the beginning
    let fullText = "HUMAN: " + prompt;

    //composes the user prompt with 'HUMAN: ' in the beginning for the PDF
    let forPDF = ["HUMAN:", prompt]
    //push to PDF
    convoContent.push(forPDF); 

    //creates a new text node using the fullText as the information
    let newNode = document.createTextNode(fullText);

    //adds the node element to the p element
    newText.appendChild(newNode);
    //adds that p element to the conversation container
    container.appendChild(newText);
    console.log("added question");


    changeRed(); //edits color
    scrollToBottom(); //makes sure we are always at the bottom of the conversation

    //creates new history for chatHistory[]
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

        //creating a new text element
        let newText2 = document.createElement("p");

        //composes the GPT output with 'ROBOT RAND: ' in the beginning
        let fullText2 = "ROBOT RAND: " + data.choices[0].message.content;

        //composes the user prompt with 'ROBOT RAND: ' in the beginning for the PDF
        let forPDF2 = ["ROBOT RAND:", data.choices[0].message.content]
        //pushes to the PDF
        convoContent.push(forPDF2);

         //creates a new text node using the fullText2 as the information
        let newNode2 = document.createTextNode(fullText2);

        //adds the node element to the p element
        newText2.appendChild(newNode2);
        //adds that p element to the conversation container
        container.appendChild(newText2);
        console.log("added response");

        document.getElementById('promptInput').value = ''; //resets prompt input


        //creates new history for chatHistory[]
        let forChatHistory2 = {role: "assistant", content: data.choices[0].message.content};
        chatHistory.push(forChatHistory2);

        //checks history thus far
        console.log(chatHistory)

        changeGreen(); //edits color
        scrollToBottom(); //makes sure we are always at the bottom of the conversation

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
    var targetWord ="ROBOT RAND:";
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


document.querySelector("#saveToImage").addEventListener("click", function(){
    let infoModal = document.querySelector(".infoModal");
    infoModal.style.display = "flex";
});

document.querySelector("#infoSave").addEventListener("click", function(){
    playerInfo.name = document.querySelector("#name").value;
    playerInfo.title = document.querySelector("#title").value;

    generatePDF();
})


