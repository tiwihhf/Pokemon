var counter = 0;
var activateBattle = false;

// Array containing dialogue
const bossArr = ["...", "It's over.", "You're far too late.", "Do you know what you're standing on?", "The grave of Chtulhu.", "Right here, right now, as we both stand on top of it", "HE will rise."];
const mobArr = ["Don't even try to stop us.", "HE will rise."];

//  EVENT LISTENER
function bossDialogue()
{
  document.querySelector('#dialogueBar').addEventListener('click',() => {
  // If no more dialogue can be loaded
  if(counter == 7)
  {
    counter = 0;
    document.querySelector('#dialogueBar').style.display = 'none';
    battleActivation();
  }

  // Show dialogue
  document.querySelector('#dialogueBar').innerHTML = bossArr[counter];
  counter++;
  });
}

function mobDialogue()
{
  document.querySelector('#dialogueBar').addEventListener('click',() => {
  // If no more dialogue can be loaded
  if(counter == 2)
  {
    counter = 0;
    document.querySelector('#dialogueBar').style.display = 'none';
    battleActivation();
  }

  // Show dialogue
  document.querySelector('#dialogueBar').innerHTML = bossArr[counter];
  counter++;
  });
}

// Function
function dialogue(isBoss) {
  if(isBoss == true) {
    document.querySelector('#dialogueBar').innerHTML = "HMP...";
    document.querySelector('#dialogueBar').style.display = 'block';
    bossDialogue();
  }
  else if(isBoss == false) {
    document.querySelector('#dialogueBar').innerHTML = "Don't even try to stop us.";
    document.querySelector('#dialogueBar').style.display = 'block';
    mobDialogue();
  }
}