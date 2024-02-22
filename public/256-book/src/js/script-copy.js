import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getDatabase, ref, push, onValue, child, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let img;
let img2;
let img3;

let currentImage1;
let currentImage2;
let currentImage3;

let switcher;
let switcher2;
let switcher3;
let switcher4;
let switcher5;
let switcher6;

let saveButton;

let currentIndex1 = 0;
let currentIndex2 = 0;
let currentIndex3 = 0;

let imagesFaces = [];

function preload() {

  let images = 86;

  for (let i = 1; i < images; i++) {
    let path = 'assets/faces/' + str(i) + '.png' // create a path to the image
    let loaded_image = loadImage(path)     // load the image from the path
    imagesFaces.push(loaded_image)             // add the loaded path to ims
  }

  
  
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvasContainer');
  background('black');
  imageMode(CENTER);
  // image(img, windowWidth/2, windowHeight/2);

  currentImage1 = imagesFaces[currentIndex1];
  
  img = currentImage1.get(0, 0, currentImage1.width, currentImage1.height / 3);
  image(img, windowWidth / 2, ((windowHeight/2)-img.height+60), img.width/1.25, img.height/1.25);

  currentImage2 = imagesFaces[currentIndex2];

  img2 = currentImage2.get(0, currentImage2.height/3, currentImage2.width, currentImage2.height / 3);
  image(img2, windowWidth / 2, windowHeight/2, img2.width/1.25, img2.height/1.25);

  currentImage3 = imagesFaces[currentIndex3];

  img3 = currentImage3.get(0, currentImage3.height/1.5, currentImage3.width, currentImage3.height);
  image(img3, windowWidth / 2, ((windowHeight/2)+(windowHeight/2)+87), img3.width/1.25, img3.height/1.25);

  switcher = select('#advance1');
  switcher2 = select('#advance2');
  switcher3 = select('#advance3');

   //activate button when mouse pressed on the button
   switcher.mousePressed(forwardImg);
   switcher2.mousePressed(forwardImg2);
   switcher3.mousePressed(forwardImg3);

   switcher4 = select('#backward1');
   switcher5 = select('#backward2');
   switcher6 = select('#backward3');
 
    switcher4.mousePressed(backwardImg);
    switcher5.mousePressed(backwardImg2);
    switcher6.mousePressed(backwardImg3);

    saveButton = select('#saveToImage');
    saveButton.mousePressed(saveToGallery);

    const firebaseConfig = {
      apiKey: "AIzaSyAaomt0YCnQ2b67QihmeI9-JlQuXzEVU7I",
      authDomain: "ai-faces.firebaseapp.com",
      projectId: "ai-faces",
      storageBucket: "ai-faces.appspot.com",
      messagingSenderId: "338300608687",
      appId: "1:338300608687:web:2f3209570f4bb0d91d745a",
      measurementId: "G-7FBSYZXNKT"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase();

    initGallery();
} 

function writeUserData(name, imageURL){
  const db = getDatabase();
  const reference = ref(db, 'drawings');
  push(reference, {
    name: name,
    canvasImage: imageURL
  }, { merge: true })

}
  
function saveToGallery(){
  let name = prompt("What's your name?");
  let imageUrl = canvas.toDataURL("image/jpeg", 0.5);

  writeUserData(name, imageUrl);
  console.log('completed saveToGallery');
  updateGallery();
}

function updateGallery(){
  const db = getDatabase();
  const reference = ref(db, 'drawings');

  let frankImageCollection = selectAll('.frankImage');
  for (let i=0; i<frankImageCollection.length;i++){
    frankImageCollection[i].remove();

  }

  onValue(reference, (snapshot) => {
    let franks = snapshot.val();
    let keys = Object.keys(franks);
    console.log(keys);
    for (let i=0; i<keys.length; i++){
      let k = keys[i];
      let playerNames = franks[k].name;
      let frankImages = franks[k].canvasImage;

      let gallery = document.querySelector(".gallery");
      let galleryImage = createImg(frankImages);
      galleryImage.class("frankImage")
      galleryImage.parent(gallery);
    }
    $('html, body').delay(500).animate({
      scrollTop: $(document).height() - $(".gallery").height()
    }, 1500, 'easeOutQuint');
  })
}

function initGallery(){
  const db = getDatabase();
  const reference = ref(db, 'drawings');
  
  let frankImageCollection = selectAll('.frankImage');
  for (let i=0; i<frankImageCollection.length;i++){
    frankImageCollection[i].remove();
  }
  
  onValue(reference, (snapshot) => {
    let franks = snapshot.val();
    let keys = Object.keys(franks);
    console.log(keys);
    for (let i=0; i<keys.length; i++){
      let k = keys[i];
      let playerNames = franks[k].name;
      let frankImages = franks[k].canvasImage;
  
      let gallery = document.querySelector(".gallery");
      let galleryImage = createImg(frankImages);
      galleryImage.class("frankImage")
      galleryImage.parent(gallery);
    }
  })
  
  } 



function draw(){
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup()
}

function forwardImg(){
  fill('black');
  rectMode(CENTER);
  rect(windowWidth/2, 50+(img.height/1.25/2), img.width, img.height/1.25);
  currentIndex1 = (currentIndex1 + 1) % imagesFaces.length;
  currentImage1 = imagesFaces[currentIndex1];
  img = currentImage1.get(0, 0, currentImage1.width, currentImage1.height / 3);
  image(img, windowWidth / 2, ((windowHeight/2)-img.height+60), img.width/1.25, img.height/1.25);
  console.log('change');
}
function forwardImg2(){
  fill('black');
  rectMode(CENTER);

  rect(windowWidth/2, windowHeight/2, img.width, img.height/1.25);
  currentIndex2 = (currentIndex2 + 1) % imagesFaces.length;
  currentImage2 = imagesFaces[currentIndex2];
  img2 = currentImage2.get(0, currentImage2.height/3, currentImage2.width, currentImage2.height / 3);
  image(img2, windowWidth / 2, windowHeight/2, img2.width/1.25, img2.height/1.25);
  console.log('change');
}
function forwardImg3(){
  fill('black');
  rectMode(CENTER);

  rect(windowWidth/2, 202+(2*(img2.height/1.25)), img.width, img.height/1.25);
  currentIndex3 = (currentIndex3 + 1) % imagesFaces.length;
  currentImage3 = imagesFaces[currentIndex3];
  img3 = currentImage3.get(0, currentImage3.height/1.5, currentImage3.width, currentImage3.height);
  image(img3, windowWidth / 2, ((windowHeight/2)+(windowHeight/2)+87), img3.width/1.25, img3.height/1.25);
  console.log('change');
}
function backwardImg(){
  fill('black');
  rectMode(CENTER);
  rect(windowWidth/2, 50+(img.height/1.25/2), img.width, img.height/1.25);
  currentIndex1 = (currentIndex1 - 1 + imagesFaces.length) % imagesFaces.length;
  currentImage1 = imagesFaces[currentIndex1];
  img = currentImage1.get(0, 0, currentImage1.width, currentImage1.height / 3);
  image(img, windowWidth / 2, ((windowHeight/2)-img.height+60), img.width/1.25, img.height/1.25);
  console.log('change');
}
function backwardImg2(){
  fill('black');
  rectMode(CENTER);

  rect(windowWidth/2, windowHeight/2, img.width, img.height/1.25);
  currentIndex2 = (currentIndex2 - 1 + imagesFaces.length) % imagesFaces.length;
  currentImage2 = imagesFaces[currentIndex2];
  img2 = currentImage2.get(0, currentImage2.height/3, currentImage2.width, currentImage2.height / 3);
  image(img2, windowWidth / 2, windowHeight/2, img2.width/1.25, img2.height/1.25);
  console.log('change');
}
function backwardImg3(){
  fill('black');
  rectMode(CENTER);

  rect(windowWidth/2, 202+(2*(img2.height/1.25)), img.width, img.height/1.25);
  currentIndex3 = (currentIndex3 - 1 + imagesFaces.length) % imagesFaces.length; 
  currentImage3 = imagesFaces[currentIndex3];
  img3 = currentImage3.get(0, currentImage3.height/1.5, currentImage3.width, currentImage3.height);
  image(img3, windowWidth / 2, ((windowHeight/2)+(windowHeight/2)+87), img3.width/1.25, img3.height/1.25);
  console.log('change');
}



window.preload = preload;
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;