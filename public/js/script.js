const socket = io();





// For typing functionality
var typing=false;
var timeout=undefined;
// var user;







/* Send message button event */
const sendBtn = document.querySelector('#send-btn');

sendBtn.addEventListener('click', () => {
    /* Message text */
    const text = document.querySelector('#inp-msg');
    let msgText = text.value;
    if(msgText == "" || msgText == " ") {
        return;
    }
    /* Username */
    const userName = document.querySelector('#name').value;

    
    socket.emit('send_msg', {
        msg: msgText,   
        user: userName
    });

    /* Setting text value to empty */
    text.value = "";
})

 






/////////////////////////////////////////////////////////////////////////





// socket.on('recieved_msg', (data) => {
//     $('#chat').append(`<li><span>${data.user}:</span>  ${data.msg}</li>`)
//     $("#chat-box").scrollTop($("#chat-box").outerHeight());
// });




socket.on('recieved_msg_right', (data) => {

  const list_item = document.createElement('li');
  list_item.className = "chatright"
  list_item.innerHTML = `<span>${data.user}:</span>  ${data.msg}`;
  $('#chat').append(list_item);
  $("#chat-box").scrollTop($("#chat-box").outerHeight());
});



socket.on('recieved_msg_left', (data) => {

  const list_item = document.createElement('li');
  list_item.className = "chatleft"
  list_item.innerHTML = `<span>${data.user}:</span>  ${data.msg}`;
  $('#chat').append(list_item);
  $("#chat-box").scrollTop($("#chat-box").outerHeight());
});





////////////////////////////////////////////////////////////////////////////////////////////////////////////








// /* Login Button */
// const loginBtn = document.querySelector('#login-btn');

// loginBtn.addEventListener('click', () => {
//     const userTag = document.querySelector('#login-inp');
//     const user = userTag.value; 

//     socket.emit('login', {
//         user: user
//     })

//     userTag.value = "";
// })




















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// For typing functionality



function typingTimeout(){
    typing=false
    socket.emit('typing', {user:userName, typing:false})
}
  
  

const userName = document.querySelector('#name').value;
  
  
$(document).ready(function(){

    $('#inp-msg').keypress((e)=>{

      // console.log(userName);

      if(e.which!=13){
          typing=true
          socket.emit('typing', {user:userName, typing:true})
          clearTimeout(timeout)
          timeout=setTimeout(typingTimeout, 1500)
      }else{
          clearTimeout(timeout)
          typingTimeout()
          //sendMessage() function will be called once the user hits enter
          // sendMessage()
      }
    })


  
    //code explained later
    socket.on('display', (data)=>{
      if(data.typing==true){
          $('.type-container').html(`<strong>${data.user} </strong> &nbsp;  is typing ...`)
      }
  
      else{
          $('.type-container').text("")
      }
          
    })

});
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
