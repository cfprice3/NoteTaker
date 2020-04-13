
//Write a function that will get already saved notes from array using app.get
//Write a function that will take a new Note, push it into an array of saved notes
//Write a function that will delete a note based on id, and then return the new array of notes.


//gives access to express and fs
var express = require("express");
var fs = require("fs");
var path = require("path");

// var db = require("./db/db.json")
var notesArr = [];


var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/api/notes", function(req, res){
    res.json(notesArr);
    // console.log(notesArr);
});

app.post("/api/notes", function(req, res){
    var newNote = req.body;
    // console.log(newNote);
    const {title, text} = newNote;
    const lastId = notesArr.length ? Math.max(...(notesArr.map(note => note.id))) : 0;
    const id = lastId + 1
    const noteNew = {title, text, id};
    notesArr.push(noteNew);
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notesArr), function(err, data){
    if(err) throw err;
    res.json(newNote);
    });
    
});


app.delete('/api/notes/:id', (req, res) => {
    let note = notesArr.find( ({ id }) => id === JSON.parse(req.params.id));
    // removes object at index of note id
    notesArr.splice( notesArr.indexOf(note), 1);
    res.end("Note deleted");
    });


app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get("*", function(req,res){
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.listen(PORT, function(){
    fs.readFile(__dirname  + "/db/db.json", function(err, data){
        if(err) throw err;
        notesArr = JSON.parse(data);
    })
    console.log("listening at Port " + PORT);
});