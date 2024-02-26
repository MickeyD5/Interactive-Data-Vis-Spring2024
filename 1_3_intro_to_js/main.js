console.log('hello world');

let myBtn = document.getElementById('button')
let myClicks = document.getElementById('clicks')
let clickCount = 0;

myClicks.innerText= `The button was clicked ${clickCount} times!`;
button.onclick= function updateCount() {
    clickCount++; 
    myClicks.innerText = `The button was clicked ${clickCount} times!`;
}


