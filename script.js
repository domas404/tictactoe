const pics = ["0_wt.png", "x_wt.png"] // array of images
var turn = 1; // 0 - nuliukai, 1 - kryziukai

var gameOn = true;
var whoStarted = 1; // 0 - nuliukai, 1 - kryziukai

var count=0;            // turns
var game_count=0;       // number of games
var tile_status = [];   // array of 9 values that are either 0, X or empty
for(var i=0; i<3; i++){
    tile_status.push([" ", " ", " "]);
}

var winner; // who won the game

// event listeners of each tile in the game board
document.getElementById("pos1").addEventListener("click", function(){ addPicture("pos1") });
document.getElementById("pos2").addEventListener("click", function(){ addPicture("pos2") });
document.getElementById("pos3").addEventListener("click", function(){ addPicture("pos3") });
document.getElementById("pos4").addEventListener("click", function(){ addPicture("pos4") });
document.getElementById("pos5").addEventListener("click", function(){ addPicture("pos5") });
document.getElementById("pos6").addEventListener("click", function(){ addPicture("pos6") });
document.getElementById("pos7").addEventListener("click", function(){ addPicture("pos7") });
document.getElementById("pos8").addEventListener("click", function(){ addPicture("pos8") });
document.getElementById("pos9").addEventListener("click", function(){ addPicture("pos9") });

// updates tile field, when it is pressed
function addPicture(id){
    if(count == 0) whoStarted=turn;
    var x = document.createElement("img");
    x.setAttribute("src", pics[turn]);
    x.setAttribute("width", "100%");
    x.setAttribute("height", "100%");
    x.setAttribute("id", "image"+id.slice(-1))
    document.getElementById(id).appendChild(x);  // adds image to tile
    count++;
    checkStatus(turn, id.slice(-1));             // checks if game hasn't ended

    document.getElementById(id).style.pointerEvents = "none"; // updates tile to prevent it from being pressed again

    if(gameOn)            // if game hasn't ended, players change turn
        changeTurn();
}

// recreates player divs, so animations could work more than once
function updatePlayer(id, class_name){
    var p = document.getElementById(id);
    p.removeAttribute("class");

    var new_p = p.cloneNode(true);
    new_p.setAttribute("class", class_name);

    p.parentNode.replaceChild(new_p, p);
}

// changes turn and adds glow effects to players' name, to let players know
function changeTurn(){
    // console.log(count);

    updatePlayer("player1", "player-name");
    updatePlayer("player2", "player-name");
    updatePlayer("x-symbol", "symbol");
    updatePlayer("zero-symbol", "symbol");

    if(turn == 0){
        turn = 1;
        
        document.getElementById("player2").classList.add("remove-glow");
        document.getElementById("zero-symbol").classList.add("lower-opacity");

        document.getElementById("player1").classList.add("add-glow");
        document.getElementById("x-symbol").classList.add("increase-opacity");
    }
    else{
        turn = 0;
        if(count==1){
            document.getElementById("player1").style.color = "#4c5c75";
            document.getElementById("player1").style.textShadow = "none";
            document.getElementById("zero-symbol").style.opacity = "1";
        }
        document.getElementById("player1").classList.add("remove-glow");
        document.getElementById("x-symbol").classList.add("lower-opacity");

        document.getElementById("player2").classList.add("add-glow");
        document.getElementById("zero-symbol").classList.add("increase-opacity");
    }
}

// determines who won the game
function determineWinner(symbol, winner, row_diag, line_1, line_2, animation_class){
    if(symbol == "x"){
        document.getElementById("p1-score").innerHTML++;
        document.getElementById("p1-score").classList.add("score-change");
        winner = p1_name + " won";
    }
    else{
        document.getElementById("p2-score").innerHTML++;
        document.getElementById("p2-score").classList.add("score-change");
        winner = p2_name + " won";
    }
    if(row_diag == 3) // either if (row == 3) else if (col == 3), or if (diag == 3) else if (adiag == 3) 
        document.getElementById("end-game-line").classList.add(line_1);
    else document.getElementById("end-game-line").classList.add(line_2);

    document.getElementById("end-game-line").classList.add(animation_class);
    document.getElementById("reset").innerHTML = "Next match";
    document.getElementById("declare-winner").innerHTML = winner + "!";

    return winner;
}

// checks status of game
function checkStatus(player, id){
    var symbol;
    var col=0, row=0, diag=0, adiag=0;

    if(player == 0) symbol = "0";
    else symbol = "x";

    id = id-1;
    input_row = Math.floor(id/3);
    input_col = id%3;

    tile_status[input_row][input_col] = symbol; // two dimentional array depicting board elements

    // checks if game has been won (row and column end scenarios)
    for(var i=0; i<3; i++){
        for(var j=0; j<3; j++){
            if(tile_status[i][j] == symbol) row++;
            if(tile_status[j][i] == symbol) col++;
        }
        if(tile_status[i][i] == symbol) diag++;
        if(tile_status[i][2-i] == symbol) adiag++;

        if(row == 3 || col == 3){
            // console.log("Player " + symbol + " won.");
            winner = determineWinner(symbol, winner, row, "row"+(i+1), "col"+(i+1), "line-animation");
            
            gameEnded();
            gameOn = false;
            break;
        }
        else {
            row=0;
            col=0;
        }
    }
    // checks if game has been won (diagonal end scenarios)
    if(diag == 3 || adiag == 3){
        // console.log("Player " + symbol + " won.");
        winner = determineWinner(symbol, winner, diag, "diag", "a-diag", "line-animation-diagonal");

        gameOn = false;
        gameEnded();
    }
    else if(count == 9){ // if tie
        // console.log("Tie.");
        winner = "Tie";
        document.getElementById("reset").innerHTML = "Next match";
        document.getElementById("declare-winner").innerHTML = winner + ".";
        gameOn = false;
        gameEnded();
    }

    // console.log("Row: " + row + "\nCol: " + col);
}

// when game has ended
function gameEnded(){
    game_count++;    // game count increments
    documentGame();  // write into game history
    count=0;         // count of turns

    for(var i=0; i<9; i++){  // all tiles are locked until players clear the board
        document.getElementById("pos"+(i+1)).style.pointerEvents = "none";
    }
}

// clears game board
function clearBoard(){
    var imageDiv;
    for(var i=0; i<9; i++){
        imageDiv = document.getElementById("image"+(i+1));
        if(imageDiv){
            imageDiv.parentNode.removeChild(imageDiv);
            // console.log(imageDiv.id);
        }
        document.getElementById("pos"+(i+1)).style.pointerEvents = "auto";
    }
    tile_status = [];
    for(var i=0; i<3; i++){
        tile_status.push([" ", " ", " "]);
    }
    document.getElementById("p1-score").classList.remove("score-change");
    document.getElementById("p2-score").classList.remove("score-change");

    document.getElementById("end-game-line").removeAttribute("class");
    document.getElementById("end-game-line").setAttribute("class", "line");

    document.getElementById("reset").innerHTML = "Reset";
    count=0;

    document.getElementById("declare-winner").innerHTML = "";
}

// listens to 'reset' or 'next match' button
const reset = document.getElementById("reset");
reset.addEventListener("click", function(){
    clearBoard();
    if(!gameOn && whoStarted == turn){
        // console.log("Started by: " + whoStarted + ", ended by: " + turn);
        changeTurn();
    }
    gameOn = true;
})

// listens to 'start over' button (clears all game history and score)
const start_over = document.getElementById("start-over");
start_over.addEventListener("click", function(){
    clearBoard();
    document.getElementById("p1-score").innerHTML = 0;
    document.getElementById("p2-score").innerHTML = 0;
    clearHistory();
    game_count=0;
    gameOn = true;
    if(turn != 1) changeTurn();
    closeMenu();
})

// listener of pause menu
const menu = document.getElementById("menu");
menu.addEventListener("click", function(){
    document.getElementById("menu-container").style.visibility = "visible";
    document.getElementById("menu-container").style.pointerEvents = "auto";

    document.getElementById("game").classList.add("blur");
})

// listener of 'resume' button
const resume = document.getElementById("resume");
resume.addEventListener("click", closeMenu);

// closes menu
function closeMenu(){
    document.getElementById("menu-container").style.visibility = "hidden";
    document.getElementById("menu-container").style.pointerEvents = "none";
    removeBlur(); 
}

// removes blur
function removeBlur(){
    document.getElementById("game").classList.remove("blur");
}

// listens to when the names are entered
document.getElementById("submit-names").addEventListener("click", displayNames);

var p1_name; // player 1 name
var p2_name; // player 2 name

// display player names
function displayNames(){
    var inputContainer = document.getElementById("input-container");
    inputContainer.style.visibility = "hidden";
    inputContainer.style.pointerEvents = "none";

    p1_name = document.getElementById("p1-name").value;
    p2_name = document.getElementById("p2-name").value;
    // console.log(p1_name + "\n" + p2_name);

    if(p1_name == "") p1_name = "Player1"; // default player 1 name
    if(p2_name == "") p2_name = "Player2"; // default player 2 name

    document.getElementById("player1").innerHTML = p1_name;
    document.getElementById("player2").innerHTML = p2_name;

    removeBlur();
}

// updates game history
function documentGame(){
    var game = document.createElement("div");
    game.innerHTML = "Game " + game_count + ": " + winner;
    game.setAttribute("class", "games-info");
    game.setAttribute("id", "game"+game_count);
    var parent = document.getElementById("game-history");
    parent.appendChild(game);
}

// clears game history
function clearHistory(){
    var el;
    for(var i=1; i<=game_count; i++){
        el = document.getElementById("game"+i);
        el.parentNode.removeChild(el);
    }
}