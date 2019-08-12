import { cur_user, token } from './form.js'
import API_URL from './backend_url.js'
import { getFeeds } from './user.js'

var cur_user_id = 0;

function userMainPage(){
    const root = document.querySelector("#root");
    while(root.firstChild){
        root.removeChild(root.firstChild);
    }
    
    // create user homepage
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
    const hello = document.createElement('h3');
    hello.textContent = ('Hi, ' + cur_user);
    hello.id = "hi";
    header.appendChild(hello);

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

    // profile button
    const l1 = document.createElement("li");
    ul.appendChild(l1);
    l1.className = "nav-item";

    const login = document.createElement("button");
    l1.appendChild(login);
    login.setAttribute("data-id-profile", "");
    login.classList.add("button");
    login.classList.add("button-primary");
    login.textContent = "Profile";
    
    // profile btn
    login.addEventListener('click', profile_page);




    // logout button
    const l2 = document.createElement("li");
    ul.appendChild(l2);
    l2.className = "nav-item";

    const signup = document.createElement("button");
    l2.appendChild(signup);
    signup.setAttribute("data-id-logout", "");
    signup.classList.add("button");
    signup.classList.add("button-secondary");
    signup.textContent = "LOG OUT";

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

    feedbtn.addEventListener('click', post_form);
        
    getCurUserId();

}

function getCurUserId(){
    const url = API_URL + '/user/';
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        cur_user_id = data.id;
    });
}

function post_form(){
    const wrap = document.createElement('div');
    document.body.appendChild(wrap);
    wrap.className = 'upvotes-wrap';

    const content = document.createElement('div');
    wrap.appendChild(content);
    content.className = 'post-form';
    content.classList.add('animate');
    
    const cross = document.createElement('img');
    cross.src = 'images/close.svg';
    content.appendChild(cross);
    cross.className = 'cross-post';

    // close window
    cross.addEventListener('click', close_list);

    const title = document.createElement('div');
    title.textContent = 'Create a post';
    title.id = 'post-top';
    content.appendChild(title);
    
    const error = document.createElement('p');
    content.appendChild(error);
    error.style.display = 'none';
    error.className = 'form-error';

    const sus = document.createElement('div');
    content.appendChild(sus);
    sus.className = 'post-form-title-wrap';
    const label = document.createElement('label');
    sus.appendChild(label);
    sus.appendChild(document.createElement('br'));
    label.textContent = 'Community';
    label.id = 'community-label';
    const input = document.createElement('input');
    input.type = 'text';
    sus.appendChild(input);
    input.placeholder = 'Choose a community (ie: s/lol)';
    input.id = 'community-input';
    input.className = 'community';

    const body = document.createElement('div');
    content.appendChild(body);
    body.id = 'post-form-body-wrap';

    const theme = document.createElement('label');
    body.appendChild(theme);
    theme.textContent = 'Title';
    theme.id = 'title-label';
    theme.name = 'title';
    
    body.appendChild(document.createElement('br'));
    const tinput = document.createElement('input');
    body.appendChild(tinput);
    tinput.type = 'text';
    tinput.placeholder = 'Title';
    tinput.id = 'community-input';
    tinput.className = 'post-form-title';

    
    const b = document.createElement('div');
    b.className = 'post-body-wrap';
    content.appendChild(b);
    
    const posts = document.createElement('label');
    posts.textContent = 'Post';
    posts.id = 'post-label';
    b.appendChild(posts);

    b.appendChild(document.createElement('br'));


    const text = document.createElement('textarea');
    b.appendChild(text);
    text.rows = 11;
    text.cols = 42;
    text.id = 'post-body';
    text.placeholder = 'Text';

    const imgWrap = document.createElement('div');
    content.appendChild(imgWrap);
    imgWrap.id = 'image-wrap';


    const btn = document.createElement('input');
    btn.type = 'file';
    btn.accept = 'image/*'
    btn.className = 'img-btn';
    btn.textContent = 'UPLOAD';
    
    const img = document.createElement('img');
    img.id = 'post-form-img';
    
    imgWrap.appendChild(btn);
    imgWrap.appendChild(img);
    
    const submit = document.createElement('button');
    submit.type = 'button';
    submit.textContent = 'POST';
    submit.className = 'post-btn';
    submit.classList.add('button');
    content.appendChild(submit);
    
    btn.addEventListener('change', (e) => {
        upload_img(e.target);
    });
    submit.addEventListener('click', post);

}

function close_list(){
    var wrap = document.querySelector('.upvotes-wrap');
    document.body.removeChild(wrap);
}

function post(){
    const title = document.querySelector('.post-form-title').value;
    const text = document.querySelector('#post-body').value;
    const sub = document.querySelector('#community-input').value;
    
    const error = document.querySelector('.form-error');
    var payload = {
        title: title,
        text: text,
        subseddit: sub
    };

    if(title == '' || text == '' || sub == ''){
        error.style.display = 'block';
        error.textContent = 'Missing title/text/community';
    }
    else{
        if(document.querySelector('#post-form-img').src != null){
            const img = document.querySelector('#post-form-img');
            payload['image'] = img.src.split(',')[1]; 
        }
        

        var wrap = document.querySelector('.upvotes-wrap');
        document.body.removeChild(wrap);

        fetch(API_URL + '/post/', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })
        .then(res => {
            if(res.status == 400){
                    throw new Error('400: Malformed Request/Image could not be processed');
            }
            else if(res.status == 403){
                throw new Error('403: InvaildToken');
            }
            return res.json();

        })
        .then(data => {
           console.log(data); 
        })
        .catch(e => console.log('Error', e));
        
    } 
}

function upload_img(e){
    var reader = new FileReader();
    reader.onload = function(){
        var img = document.querySelector('#post-form-img');
        img.src = reader.result;
    };
    reader.readAsDataURL(e.files[0]);
}

function profile_page(){
    const root = document.querySelector("#root");
    while(root.firstChild){
        root.removeChild(root.firstChild);
    }
    
    // create user homepage
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
    const hello = document.createElement('h3');
    hello.textContent = ('Hi, ' + cur_user);
    hello.id = "hi";
    header.appendChild(hello);

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

    // profile button
    const l1 = document.createElement("li");
    ul.appendChild(l1);
    l1.className = "nav-item";

    const login = document.createElement("button");
    l1.appendChild(login);
    login.setAttribute("data-id-profile", "");
    login.classList.add("button");
    login.classList.add("button-primary");
    login.textContent = "MAIN PAGE";

    // back to main page
    login.addEventListener('click', back_main);




    // logout button
    const l2 = document.createElement("li");
    ul.appendChild(l2);
    l2.className = "nav-item";

    const signup = document.createElement("button");
    l2.appendChild(signup);
    signup.setAttribute("data-id-logout", "");
    signup.classList.add("button");
    signup.classList.add("button-secondary");
    signup.textContent = "LOG OUT";

    const body = document.createElement('div');
    body.className = 'profile-wrap';
    root.appendChild(body);

    fetch(API_URL + '/user/', {
        headers:{
            'Authorization': `Token ${token}`
        } 
    })
    .then(res => {
        if(res.status == 400){
                throw new Error('400: Malformed Request');
        }
        else if(res.status == 403){
            throw new Error('403: InvaildToken');
        }
        return res.json();
    }) 
    .then(data => {
        const topp = document.createElement('div');
        body.appendChild(topp);
        const h2 = document.createElement('h2');
        topp.appendChild(h2);
        h2.textContent = data.name;


        const info = document.createElement('div');
        info.className = 'info-wrap';
        body.appendChild(info);
        

        const ul = document.createElement('ul');
        info.appendChild(ul);

        var uname = document.createElement('li');
        ul.appendChild(uname);
        var uname_title = document.createElement('span');
        uname.appendChild(uname_title);
        uname_title.textContent = 'Username: ';
        uname.appendChild(document.createTextNode(data.username));


        var email = document.createElement('li');
        ul.appendChild(email);
        var email_title = document.createElement('span');
        email.appendChild(email_title);
        email_title.textContent = 'E-mail: ';
        email.appendChild(document.createTextNode(data.email));


        var post = document.createElement('li');
        ul.appendChild(post);
        var post_title = document.createElement('span');
        post.appendChild(post_title);
        post_title.textContent = 'Number of posts: ';
        post.appendChild(document.createTextNode(data.posts.length));


        var up = document.createElement('li');
        ul.appendChild(up);
        var up_title = document.createElement('span');
        up.appendChild(up_title);
        up_title.textContent = 'Number of upvotes: ';
        getVotesNum(data.posts, up)
        
        var f = document.createElement('li');
        ul.appendChild(f);
        var f_title = document.createElement('span');
        f.appendChild(f_title);
        f_title.textContent = 'Following: ';
        f.appendChild(document.createTextNode(data.following.length));

        
        var fd = document.createElement('li');
        ul.appendChild(fd);
        var fd_title = document.createElement('span');
        fd.appendChild(fd_title);
        fd_title.textContent = 'Followed: ';
        fd.appendChild(document.createTextNode(data.followed_num));

    })
    .catch(e => console.log('Error', e));
    
}

function getVotesNum(ids, up){
    var urls = [];
    ids.forEach(e =>{
        var url = API_URL + '/post/?id=' + e;
        urls.push(url);
    });
    
    var res = 0;
    Promise.all(urls.map(url => 
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(res => {
            if(res.status == 400){
                throw new Error('400: Malformed Request');
             
            }
            else if(res.status == 403){
                throw new Error('403: Malformed Request');
            }
            return res.json();
        })
        .catch(function(e){return e;})
    ))
    .then(data => {
        for(const post of data){

            //console.log(res);
            res += post.meta.upvotes.length;
        } 
        up.appendChild(document.createTextNode(res));

    })

}

function back_main(){
    const root = document.querySelector("#root");
    while(root.firstChild){
        root.removeChild(root.firstChild);
    }
    getFeeds();
}

export { userMainPage, close_list, cur_user_id };
