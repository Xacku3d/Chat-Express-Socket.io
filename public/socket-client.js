window.onload = () => {
    const messageArea = document.getElementById('messageArea');
    const socket = io.connect();
    const messageForm = document.getElementById('messageForm');
    const message = document.getElementById('message');
    const chat = document.getElementById('chat');
    const userform = document.getElementById('userForm');
    const userformArea = document.getElementById('userFormArea');
    const users = document.getElementById('users');
    const username = document.getElementById('username');

    messageArea.style.display = 'none';

    //Send new message
    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        socket.emit('send message', message.value);
        message.value = '';
    });

    //Show new message
    socket.addEventListener('new message', (data) => {
        const msg = document.createElement('div');
        msg.className = 'msg';
        msg.innerHTML = `<strong>${data.user}</strong>:  ${data.msg}`;
        chat.append(msg);
    });

    //Add new user
    userform.addEventListener('submit', (event) => {
        event.preventDefault();
        socket.emit('new user', username.value, (data) => {
            if(data){
                userformArea.style.display = 'none';
                messageArea.style.display = '';
            }
        });
        username.value = '';
    });

    //Show and update users
    socket.addEventListener('get users', (data) => {
        let html = '';
        for(let i = 0; i < data.length; i++){
            html += '<li class="list-group-item">' + data[i] + '</li>';
        }
        users.innerHTML = html;
    });
}


