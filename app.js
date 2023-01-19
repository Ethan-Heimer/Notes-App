const AddButton = document.getElementById("Add");
const ClearButton = document.getElementById("Clear");
const StickyNotesContainer = document.getElementById("StickyNotes");

$(".tooltip").tooltip();

const notes = LoadNotes();

AddButton.addEventListener("click", () => notes.push(Note("", "", {x:screen.width/2-90, y:300})))
ClearButton.addEventListener("click", ClearNotes);

setInterval(SaveNotes, 1000); //auto Save

function Note(heading, text, position){
    //create note 
    const noteElement = document.createElement("div");
    const header = document.createElement("input"); 
    const input = document.createElement("textarea"); 

    const deleteButton = document.createElement("botton");

    noteElement.classList.add("Draggable");
    noteElement.classList.add("Note");

    input.type = "text";
    input.placeholder = "Type note here";
    input.rows=1;
    input.cols=20;

    header.type = "text";
    header.placeholder = "Header";


    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can">';

    noteElement.appendChild(header);
    noteElement.appendChild(input);
    noteElement.appendChild(deleteButton); 

    noteElement.classList.add("tooltip");
    noteElement.title = "Click to Drag!";

    StickyNotesContainer.appendChild(noteElement);

    $(".Draggable").draggable({containment: "parent"});

    //methods

    const GetElement = () =>{return noteElement}

    const GetText = () => {
        return input.value;
    }

    const GetHeader = () => {
        return header.value;
    }

    const GetPosition = () =>{
        var noteRect = noteElement.getBoundingClientRect();
        return{x: noteRect.x, y: noteRect.y};
    }

    const SetText = (value) => input.value = value; 

    const SetHeader = (value) => header.value = value; 

    const SetPosition = ({x,y}) => {
        noteElement.style.position = "absolute";
        noteElement.style.left = x+"px"; 
        noteElement.style.top = y+"px";
    } 

    const Destroy = () => {
        noteElement.remove();

        let index = -1;

        notes.forEach(x=> {
            if(x.GetElement() === noteElement) index = notes.indexOf(x);
        })

        notes.splice(index, 1);
    }

    //extra logic

    SetText(text);
    SetPosition(position);
    SetHeader(heading);

    deleteButton.addEventListener("click", Destroy);

    return{
        GetText, GetPosition, SetText, SetPosition, GetElement, Destroy, GetHeader, SetHeader
    }
}

function SaveNotes(){

    let noteData = [];
    notes.forEach(x=>{
        let position = x.GetPosition();
        let text = x.GetText();
        let heading = x.GetHeader();
        
        noteData.push({position, text, heading}); 
    })

    localStorage.setItem("Note Data", JSON.stringify(noteData));
}

function LoadNotes(){
    let _notes = []
    let notesData = JSON.parse(localStorage.getItem("Note Data")) || [];

    console.log(notesData);
    notesData.forEach(n=> {
        _notes.push(Note(n.heading, n.text, n.position)); 
    })

    return _notes; 
}

function ClearNotes()
{
    while(notes.length > 0){
        console.log(notes.length);
        notes[notes.length-1].Destroy();
    }

    SaveNotes();
}