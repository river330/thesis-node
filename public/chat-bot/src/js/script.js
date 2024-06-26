export let convoContent = []; //runing conversations being logged
export let playerInfo = {
    name: '',
    title: '',
}
export let number = 0;

//an array of the running chatHistory being using as context for the GPT
let chatHistory = [{role: "system", content: "Your name is Robot Rand. You are an assistent who loves talking to people and helping them with whatever they need. You like to keep your language very casual and are very energetic and colorful in your speech. Here is some characteristics about Rand: a graphic designer, loves talking & listening,interested in deep Rand[a graphic designer, loves talking & listening, interested in deep conversations, loves spending time with friends & family, very talkative, loves going on walks, lives in New York City, loves asking questions, loves R&B music, gay, queer, filipino, immigrant, enjoys going to museums, interested in learning languages, enjoys coding, loves Matisse paintings, enjoys quality time, prioritizes healthy communication, overthinker, gets anxious easily, loves to write, loves to read, enjoys queer period piece novels, enjoys writing poetry, a romantic, in early 20s, values time with others, overly affectionate, reassuring, unique & very casual talking patterns, very silly & energetic, loves to speak with enthusiasm, enjoys others, wants to be loved, wants to love, wants to feel wanted. MAKE SURE YOUR RESPONSE IS WITHIN 2000 tokens"}];

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

    //creating a new text element
    let tempText = document.createElement("p");

    //composes the GPT output with 'ROBOT RAND: ' in the beginning
    let tempfullText = "ROBOT RAND: ..."
    let tempNode = document.createTextNode(tempfullText);

        //adds the node element to the p element
        tempText.appendChild(tempNode);
        //adds that p element to the conversation container
        container.appendChild(tempText);

        changeGreen(); //edits color
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
            max_tokens: 2000,
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
        container.removeChild(container.lastChild);
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

        number = number+1;

    })
    .catch(error => console.error('Error:', error))
});

//edit UI to be red for "Human:"
function changeRed() {
    var targetWord = "HUMAN:"; // The word you're searching for
    $(".conversationContainer p").each(function() {
        var regex = new RegExp('('+ targetWord +')', 'gi');
        $(this).html($(this).html().replace(regex, '<span class="red">$1</span>'));
    });

}

//edit UI to be green for "Robot RAND:"
function changeGreen() {
    var targetWord ="ROBOT RAND:";
    $(".conversationContainer p").each(function() {
        var regex = new RegExp('('+ targetWord +')', 'gi');
        $(this).html($(this).html().replace(regex, '<span class="green">$1</span>'));
    });
   

}

import { generatePDF } from "./print.js";
window.generatePDF = generatePDF;

//makes sure to scroll bottom of conversation container 
function scrollToBottom() {
    var $container = $('.conversationContainer');
    var scrollHeight = $container.prop('scrollHeight');
    $container.animate({
        scrollTop: scrollHeight
    }, 500); // Adjust the duration (500ms) as needed
};

//allowing enter button to submit prompt
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
    let infoModal = document.querySelector(".infoModal");
    infoModal.style.display = "none";
    convoContent = [];
    console.log(convoContent);

    let parentElement = document.querySelector(".conversationContainer");

    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
    document.querySelector("#name").value = "";
    document.querySelector("#title").value = "";

})

// document.querySelector('#exitButton').addEventListener("click", function(){
//     let infoModal = document.querySelector(".infoModal");
//     infoModal.style.display = "none";
//     convoContent = [];
//     console.log(convoContent);

//     let parentElement = document.querySelector(".conversationContainer");

//     while (parentElement.firstChild) {
//         parentElement.removeChild(parentElement.firstChild);
//     }
// })


