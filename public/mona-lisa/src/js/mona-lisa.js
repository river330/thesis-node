
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getDatabase, ref, push, onValue, child, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDjbs-PqNjfjSBH_pUcidZx5h-LFy5DF0M",
    authDomain: "mona-lisa-5a94e.firebaseapp.com",
    databaseURL: "https://mona-lisa-5a94e-default-rtdb.firebaseio.com",
    projectId: "mona-lisa-5a94e",
    storageBucket: "mona-lisa-5a94e.appspot.com",
    messagingSenderId: "714638632203",
    appId: "1:714638632203:web:205c1c13ea20eb095d6e0e",
    measurementId: "G-2MC1FFTY8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const reference = ref(db, 'drawings');

window.onload = (event) => {
    onValue(reference, (snapshot) => {
        let franks = snapshot.val();
        let keys = Object.keys(franks);
        console.log(keys);
        $(".gallery").empty();

        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            let frankImages = franks[k].canvasImage;
            let frankPrompts = franks[k].promptGiven;

            let gallery = document.querySelector(".gallery");
            let galleryImage = document.createElement('img');
            galleryImage.src = frankImages;
            galleryImage.setAttribute("name", frankPrompts);
            galleryImage.classList.add("frankImage");
            gallery.prepend(galleryImage);
        }
    })
};

let generatingButton = document.querySelector("#promptSubmit");
document.getElementById('promptForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    const prompt = document.getElementById('promptInput').value;

    generatingButton.innerHTML = "GENERATING...";



    fetch('/api/openai/images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
        })
    })
        .then(response => response.json())

        // .then(data => document.querySelector(".testImg").src = data.data[0].url);
        .then(data => {
            generatingButton.innerHTML = "Generate Image";
            console.log(data);
            push(reference, {
                canvasImage: data.data[0].url,
                promptGiven: prompt,
            }, { merge: true });

            onValue(reference, (snapshot) => {
                let franks = snapshot.val();
                let keys = Object.keys(franks);
                console.log(keys);
                $(".gallery").empty();

                for (let i = 0; i < keys.length; i++) {
                    let k = keys[i];
                    let frankImages = franks[k].canvasImage;
                    let frankPrompts = franks[k].promptGiven;

                    let gallery = document.querySelector(".gallery");
                    let galleryImage = document.createElement('img');
                    galleryImage.src = frankImages;
                    galleryImage.setAttribute("name", frankPrompts);
                    galleryImage.classList.add("frankImage");
                    gallery.prepend(galleryImage);
                }
            });
            $('html, body').delay(500).animate({
                scrollTop: $(document).height() - $(".frankImage").first().height()
              }, 1500, 'easeOutQuint');
           
        })
        .catch(error => console.error('Error:', error));

});

// get the modal
let modal = document.getElementById("myModal");

let modalImg = document.getElementById("img01");
let captionText = document.getElementById("caption");

let whereAmI;

$('.gallery').on('click', "img", function () {
    console.log("click");
    modal.style.display = "flex";
    modalImg.src = this.src;
    captionText.innerHTML = this.getAttribute("name");
    document.body.style.overflow = "hidden";
    whereAmI = $(window).scrollTop();
    $(window).scrollTop(0);
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
    $(window).scrollTop(whereAmI);

    document.body.style.overflow = "visible";
}

$(document).ready(function() {
    $('#promptInput').keypress(function(event) {
        if (event.which == 13) { // 13 is the Enter key
            event.preventDefault(); // Prevent the default action to stop submitting the form
            $('#promptSubmit').click(); // Trigger the click event on your submit button
        }
    });
});