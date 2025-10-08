
var sendBtn = document.getElementById('sendBtn');
var textbox = document.getElementById('textbox');
var chatContainer = document.getElementById('chatContainer');



var user = {message:""};




var arrayOfPossibleMessage = [
    {message: "hi", response: "hello"},
    {message: "what is thesis", response: "A thesis, or dissertation, is a document submitted in support of candidature for an academic degree or professional qualification presenting the author's research and findings"},
    {message: "what is abstract", response: "An abstract is a brief summary of a research article, thesis, review, conference proceeding, or any in-depth analysis of a particular subject and is often used to help the reader quickly ascertain the paper's purpose."},
    {message: "what is introduction", response: "The introduction allows you to orient the reader to your research project and preview the organisation of your thesis. In the introduction, state what the topic is about, explain why it needs to be further researched and introduce your research question(s) or hypothesis."},
    ]




function sendMessage(userMessage){
    
    const messageElement = document.createElement('div');
    messageElement.style.textAlign = "right";
    messageElement.style.margin = "10px";

    messageElement.innerHTML = "<span> You: </span>" +
                                "<span>" +userMessage+ "</span>";

    chatContainer.appendChild(messageElement);


}

sendBtn.addEventListener('click',function(e){

    var userMessage = textbox.value;

    if(userMessage == ""){
        alert('Please type a message');
    }else{

        let userMessageText = userMessage.trim();
        user.userMessage = userMessageText;
        textbox.value = "";
        sendMessage(userMessageText);
        chatbotResponse(userMessageText)
    }



function chatbotResponse(userMessage){

        var chatbotmessage = "";

        if(userMessage.length > 5 || userMessage == "hi"){
            var result = arrayOfPossibleMessage.filter(val => val.message.includes(userMessage.toLowerCase()));

            if(result.length > 0){
                var response = result[0].response;
                chatbotmessage = response;

            }else{
                chatbotmessage = "please send another message";
            }
        }else{
                chatbotmessage = "please send different message";

        }

        var messageElement = document.createElement('div');

        messageElement.innerHTML = "<span>Chatbot: </span>" +
                                    "<span>"+chatbotmessage+"</span>";




        setTimeout(()=>{
            messageElement.animate([{easing:"ease-in",opacity:0.5},{opacity:1}],{duration:1000})
            chatContainer.appendChild(messageElement);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
        },1000)                            

        
    }

})