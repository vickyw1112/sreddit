import { cancelForm, validate_login, validate_signup } from './form.js'
import API_URL from './backend_url.js'
function initMainPage() {
    const root = document.querySelector("#root");

    const header = document.createElement("header");
    // header
    root.appendChild(header);
    header.classList.add("banner");
    header.id = "nav";
    
    const h1 = document.createElement("h1");
    h1.classList.add("flex-center");
    h1.textContent = "Seddit";
    h1.id = "logo";

    header.appendChild(h1);

    // init nav, search bar
    const ul = document.createElement("ul");
    ul.className = "nav";
    header.appendChild(ul);
    // seaarch bar 
    const search = document.createElement("li");
    ul.appendChild(search);
    search.classList.add("nav-item");
    const input = document.createElement("input");
    search.appendChild(input);
    input.id = "search";
    input.setAttribute("data-id-search", "");
    input.placeholder = "Search Seddit";
    input.setAttribute("type", "search");

    // login button
    const l1 = document.createElement("li");
    ul.appendChild(l1);
    l1.className = "nav-item";
    
    const login = document.createElement("button");
    l1.appendChild(login);
    login.setAttribute("data-id-login", "");
    login.classList.add("button");
    login.classList.add("button-primary");
    login.textContent = "Log In";
    
    // sign up
    const l2 = document.createElement("li");
    ul.appendChild(l2);
    l2.className = "nav-item";
    
    const signup = document.createElement("button");
    l2.appendChild(signup);
    signup.setAttribute("data-id-signup", "");
    signup.classList.add("button");
    signup.classList.add("button-secondary");
    signup.textContent = "Sign Up";

    // feed
    const main = document.createElement("main");
    root.appendChild(main);
    main.setAttribute("role", "main");
    const feed = document.createElement("ul");
    main.appendChild(feed);
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");

    const feedheader = document.createElement("div");
    feed.appendChild(feedheader);
    feedheader.classList.add("feed-header");
    const feedtitle = document.createElement("h1");
    feedheader.appendChild(feedtitle);
    feedtitle.classList.add("feed-title");
    feedtitle.classList.add("alt-text");
    feedtitle.textContent = "Popular posts";

    const feedbtn = document.createElement("button");
    feedheader.appendChild(feedbtn);
    feedbtn.classList.add("button");
    feedbtn.classList.add("button-secondary");
    feedbtn.textContent = "Post";

    displayFeed(feed);
    

    
}

function initLogin(){

    // select login button
    const btn = document.querySelector(".button");

    // add event listener
    btn.addEventListener('click', () => {

        var lform = document.createElement("form");
        var divWrap = document.createElement("div");
        divWrap.classList.add("form-wrapper");
        
        lform.classList.add("animate");
        divWrap.appendChild(lform);
        
        var header = document.createElement("h1");
        header.textContent = "Login";
        lform.appendChild(header);

       
        //error message
        const error = document.createElement("p");
        error.className = "form-error";
        error.style.display = "none";
        lform.appendChild(error);


        // create form entries 
        var username  = document.createElement("label");
        username.textContent = "Username";
        lform.appendChild(username);
        lform.appendChild(document.createElement("br"));

        var input1 = document.createElement("input");
        input1.type = "text";
        input1.placeholder = "username";
        input1.name = "uname";
        lform.appendChild(input1);

        

        lform.appendChild(document.createElement("br"));
        
        var psd  = document.createElement("label");
        psd.textContent = "Password";
        lform.appendChild(psd);
        lform.appendChild(document.createElement("br"));

        var input2 = document.createElement("input");
        input2.type = "password";
        input2.placeholder = "password";
        input2.name = "psd";
        lform.appendChild(input2);

        lform.appendChild(document.createElement("br"));

        var b = document.createElement("button");
        b.classList.add("login-button");
        b.textContent = "Login"
        b.type = "button";
        lform.appendChild(b);
         
        
        var cancel = document.createElement("button");
        cancel.classList.add("cancel-button");
        cancel.textContent = "Cancel"
        cancel.type = "button";
        lform.appendChild(cancel);
        
        document.body.appendChild(divWrap);
        
        // add cacel btn cancel listener
        cancelForm();
        validate_login();
    
    });

    
}


function initSignup(){

    // select signup button
    const btn = document.querySelector(".button-secondary");

    // add event listener
    btn.addEventListener('click', () => {

        var lform = document.createElement("form");
        var divWrap = document.createElement("div");
        divWrap.classList.add("form-wrapper");
        
        lform.classList.add("animate");
        divWrap.appendChild(lform);
        
        var header = document.createElement("h1");
        header.textContent = "Sign Up";
        lform.appendChild(header);

       
        //error message
        const error = document.createElement("p");
        error.className = "form-error";
        error.style.display = "none";
        lform.appendChild(error);


        // create form entries 
        var username  = document.createElement("label");
        username.textContent = "Username";
        lform.appendChild(username);
        lform.appendChild(document.createElement("br"));

        var input1 = document.createElement("input");
        input1.type = "text";
        input1.placeholder = "username";
        input1.name = "uname";
        lform.appendChild(input1);

        

        lform.appendChild(document.createElement("br"));
        
        var psd  = document.createElement("label");
        psd.textContent = "Password";
        lform.appendChild(psd);
        lform.appendChild(document.createElement("br"));

        var input2 = document.createElement("input");
        input2.type = "password";
        input2.placeholder = "password";
        input2.name = "psd";
        lform.appendChild(input2);

        lform.appendChild(document.createElement("br"));

        var email = document.createElement("label");
        email.textContent = "Email Addr";
        lform.appendChild(email);
        lform.appendChild(document.createElement("br"));

        var input3 = document.createElement("input");
        input3.type = "email";
        input3.placeholder = "email address";
        input3.name = "emailadd";
        lform.appendChild(input3);

        lform.appendChild(document.createElement("br"));

        var name = document.createElement("label");
        name.textContent = "Nickname";
        lform.appendChild(name);
        lform.appendChild(document.createElement("br"));

        var input4 = document.createElement("input");
        input4.type = "text";
        input4.placeholder = "name";
        input4.name = "nname";
        lform.appendChild(input4);

        lform.appendChild(document.createElement("br"));

        var b = document.createElement("button");
        b.classList.add("login-button");
        b.textContent = "Create"
        b.type = "button";
        lform.appendChild(b);
         
        
        var cancel = document.createElement("button");
        cancel.classList.add("cancel-button");
        cancel.textContent = "Cancel"
        cancel.type = "button";
        lform.appendChild(cancel);
        
        document.body.appendChild(divWrap);
        
        // add cacel btn cancel listener
        cancelForm();
        validate_signup();
    
    });

}

function displayFeed(feed){
    fetch(API_URL + "/post/public")
    .then(response => response.json())
    .then(data => {
        data.posts.sort(function(a, b) {
            return a.meta.published > b.meta.published;
        });
        for(const item of data.posts){
            const li = document.createElement("li");
            feed.appendChild(li);
            li.className = "post";
            li.setAttribute("data-id-post", "");
            
            const vote = document.createElement("div");
            li.appendChild(vote);
            vote.className = "vote";
            const up = document.createElement("img");
            up.src = "images/up.svg";
            up.className = 'pic';
            vote.appendChild(up);

            const num = document.createElement("p");
            vote.appendChild(num);
            num.className = "vppl";
            num.setAttribute("data-id-upvotes", "");
            num.textContent = item.meta.upvotes.length;

            const down = document.createElement("img");
            down.src = "images/down.svg";
            down.className = 'pic';
            vote.appendChild(down);
            
            const subtitle = document.createElement("div");
            li.appendChild(subtitle);
            subtitle.className = "top-wrapper";

            const sub = document.createElement("div");
            subtitle.appendChild(sub);
            sub.textContent = "s/" + item.meta.subseddit;
            sub.className = "suseddit";

            const span = document.createElement("span");
            subtitle.appendChild(span);
            span.textContent = "•";
            span.className = "dot";

            const time = document.createElement("div");
            subtitle.appendChild(time);
            time.className = "post-time";
            var date = new Date(item.meta.published * 1000).toLocaleDateString("en-US");
            time.textContent = date;

            const content = document.createElement("div");
            li.appendChild(content);
            content.className = "content";
            

            const h3 = document.createElement("h3");
            content.appendChild(h3);
            h3.setAttribute("data-id-title", "");
            h3.classList.add("post-title");
            h3.classList.add("alt-text");
            h3.textContent = item.title;
            
            if(item.image != null){
                const img = document.createElement("img");
                img.setAttribute("src", "data:image/png;base64," + item.image);
                img.className = "post-img";
                content.appendChild(img);
            }

            const text = document.createElement("p");
            content.appendChild(text);
            text.className = "post-content";
            text.textContent = item.text;
            
            const btm = document.createElement("div");
            li.appendChild(btm);
            btm.className = "bottom-wrapper";
            
            const comments = document.createElement("div");
            btm.appendChild(comments);
            comments.className = "comments";
            comments.textContent = item.comments.length + " comments";
            
            const au = document.createElement("div");
            au.setAttribute("data-id-author", "");
            au.className = "author";
            btm.appendChild(au);
            au.textContent = "Posted by " + item.meta.author;
            const wholeWrap = document.createElement("div");
            li.appendChild(wholeWrap);
            wholeWrap.appendChild(subtitle);
            wholeWrap.appendChild(content);
            wholeWrap.appendChild(btm);
        }
         
    });
}

export { initMainPage, initLogin, initSignup, displayFeed };
