const socket = io();


const  form = document.getElementById("message-container");
const messagebox = document.getElementById("chat")
const  messageInput = document.getElementById("message-input");
const myname = document.getElementById("your-name")
const mymembers = document.getElementById("members")

// const name = prompt("enter your name");
// socket.emit("new-user-joined", name);  old code

socket.on('connect', () => {
    let username = prompt('Enter your name:');
    if (username && username.trim()) {
        socket.emit('new-user-joined', username);
    } else {
        // Handle case where username is invalid (e.g., user cancels the prompt)
        alert("A valid username is required to join the chat.");
        socket.disconnect(); // Optionally disconnect if no valid name is provided
    }
});



// to announce who joined 
socket.on('user-list', (users) =>{
    
    for (let id in users){
        displayuserlist(users, socket.id);
        if(id === socket.id ){
            addname(users[id]);
        }else{
            appand(`${users[id]} :have joined the chat`, 'left')
        }
    }
});

// to announce who left

socket.on('user-left',(user) => {
    appand(`${user} :have left the chat`, 'left')
})


// sending and receving messages
socket.on("message-received", data =>{
    appand(`${data.name}: ${data.message}`, "left")
})

// to turn off default behavior of the message input so page do not refreash
form.addEventListener("submit", function(e) {
    e.preventDefault()
})

// to display user name on top of the tab
addname = (name) => {
    myname.innerText = name;
    myname.classList.add("my-name");
}



appand = (message , position) => {
    const messageelement = document.createElement("div");
    messageelement.innerText = message;
    messageelement.classList.add(position);
    messagebox.append(messageelement);
    
}

// to add all members in side pannel
displayuserlist = (users , id ) =>{
    let userlisthtml = '';
    for (let i in users){
        if (i === id){
            userlisthtml += `<li>${users[i]}(you)</li>`;
        }else{
            userlisthtml += `<li>${users[i]}</li>`;
        }
    }
    document.getElementById("list").innerHTML = userlisthtml;

}

sendmessage = () => {
    message = messageInput.value;
    console.log(message)
    messageInput.value = '';
    socket.emit("message-send", message)
    appand(`you : ${message}`, 'right')
}

// side bar for total members

let openham = document.getElementById("open-ham")
let closeham = document.getElementById("close-ham")
let option = document.getElementById("option")


closeham.addEventListener("click",function(){
    option.style.setProperty("width","0px")
    option.style.setProperty("border-left","0px")
    closeham.style.setProperty("display","none")
    openham.style.setProperty("display","block")
})
openham.addEventListener("click",function(){
    option.style.setProperty("width","auto")
    option.style.setProperty("border-left","3px solid #fff")
    closeham.style.setProperty("display","block")
    openham.style.setProperty("display","none")
})
