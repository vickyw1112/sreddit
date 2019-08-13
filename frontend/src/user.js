import API_URL from './backend_url.js'
import { userMainPage, close_list, cur_user_id } from './helper.js'
import { token, cur_user } from './form.js'
console.log(token);

var cur_feed = 0;
function getFeeds(){

    fetch(API_URL + '/user/feed',{
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }  
    })
    .then(res => {
        if(res.status === 403){
            while(document.body.firstChild){
                document.body.removeChild(document.body.firstChild);
            }
            
            const h1 = document.createElement('h1');
            document.body.appendChild(h1);
            h1.textContent = "Invaild Auth Token, please refresh and login again";
            throw new Error('403: bad token');
        }
        return res.json();
    })
    .then(data => {
        cur_feed = 10;
        userMainPage(cur_user);
        
        const feed = document.querySelector("#feed");
        // if no posts
        if(!data.posts.length){
            const notice = document.createElement('div');
            feed.appendChild(notice);
            notice.id = "notice";
            notice.textContent = "hmm...you didn't have any feeds";
        }

        else{
            
            // empty feed, in case
            while(feed.childElementCount >= 2){
                feed.removeChild(feed.lastChild);
            }
                

            // list user's feeds
            for(const item of data.posts){
                display(feed, item); 
            }
 
            infinity_scroll();
        }
    
    })
    .catch(e => console.error('Error:', e));
}

function show_upvotes(users){
    var urls = [];
    users.forEach(e =>{
        var url = API_URL + '/user/?id=' + e;
        urls.push(url); 
    });
    
    // modal
    const div = document.createElement('div');
    div.className = "upvotes-wrap";
    document.body.appendChild(div);
    const ul = document.createElement('ul');
    div.appendChild(ul);
    ul.className = "vote-people";
    ul.classList.add('animate');
    const cross = document.createElement('img');
    cross.className = 'cross';
    cross.src = 'images/close.svg';
    ul.appendChild(cross);
    cross.title = 'close window';


    // close window
    div.addEventListener('click', close_list);

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
        for(const usr of data){
            const li = document.createElement('li');
            ul.appendChild(li);
            li.textContent = usr.username;
            li.className = 'ppl-list';
        } 
    })
    .catch(e => console.log('Error:' + e));
}

function show_comments(comments){

    const div = document.createElement('div');
    div.className = "upvotes-wrap";
    document.body.appendChild(div);
    const content  = document.createElement('div');
    div.appendChild(content);
    content.className = "comment_list";
    content.classList.add('animate');
    const cross = document.createElement('img');
    cross.className = 'cross-comment';
    cross.src = 'images/close.svg';
    content.appendChild(cross);
    cross.title = 'close window';
    
    for(const item of comments){
       const wrap = document.createElement('div');
        content.appendChild(wrap);
       
        // time who
        const topp = document.createElement('div');
        wrap.appendChild(topp);
        topp.className = 'top-wrapoer';

        const auth = document.createElement('div');
        topp.appendChild(auth);
        auth.textContent = item.author;
        auth.className = 'suseddit';

        const dot = document.createElement('span');
        topp.appendChild(dot);
        dot.className = "dot";
        dot.textContent = '•';

        const time = document.createElement('div');
        topp.appendChild(time);
        time.className = 'post-time'

        var date = new Date(item.published * 1000).toLocaleDateString("en-US");
        time.textContent = date;

        const body = document.createElement('div');
        body.textContent = item.comment;
        body.className = 'ppl-comment';
        wrap.appendChild(body);
        

        content.appendChild(document.createElement('br'));
    }
    
    const btm = document.createElement('div');
    content.appendChild(btm);
    btm.className = 'comment-btm';
    const input = document.createElement('textarea');
    input.className = 'comment-input';
    input.placeholder = 'write a comment...';
    input.rows = 4;
    input.cols = 50;
    btm.appendChild(input);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button';
    btn.textContent = 'Post';
    btm.appendChild(btn);


    // close window
    cross.addEventListener('click', close_list);

}


function up_vote(e, item){
    var url = API_URL + '/post/vote/?id=' + item.id;
    const numOfPeople = e.target.parentNode.childNodes[1];
    if(!(item.meta.upvotes.includes(cur_user_id))){
        fetch(url, {
            method: 'PUT',
            headers: {
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
            //numOfPeople.textContent = (item.meta.upvotes.length + 1);
            getFeeds();
        })
        .catch(e => console.log('Error:' + e));
    }
    else{
    
        numOfPeople.textContent = item.meta.upvotes.length;
    }
}

function down_vote(e, item){
    var url = API_URL + '/post/vote/?id=' + item.id;
    const numOfPeople = e.target.parentNode.childNodes[1];

    // if user has upvote for cur post
    if(item.meta.upvotes.includes(cur_user_id)){
        fetch(url, {
            method: 'DELETE',
            headers: {
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
            //numOfPeople.textContent = (item.meta.upvotes.length - 1);
            getFeeds();
        })
        .catch(e => console.log('Error:' + e));
    }
    else{
    
        numOfPeople.textContent = item.meta.upvotes.length;
    }
}

function infinity_scroll(){
    document.addEventListener('scroll', event => {
        var isExecuted = false;
        if (window.scrollY > (document.body.offsetHeight - window.outerHeight - 10) && !isExecuted) {
            isExecuted = true;
            
            // fetch new data
            
        fetch(API_URL + '/user/feed?p=' + cur_feed, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }  
        })
        .then(res => {
            if(res.status === 403){
                while(document.body.firstChild){
                    document.body.removeChild(document.body.firstChild);
                }
                
                const h1 = document.createElement('h1');
                document.body.appendChild(h1);
                h1.textContent = "Invaild Auth Token, please refresh and login again";
                throw new Error('403: bad token');
            }
            return res.json();
        
        })
        .then(data => {
            console.log(data.posts.length);
            if(data.posts.length != 0){
                cur_feed += 10;
                const feed = document.querySelector('#feed');
                for(const item of data){
                    display(feed, item);
                }
                
            }
        })
        .catch(e => console.log('Error:' + e));

        setTimeout(() => {
            isExecuted = false;
        }, 1000);
            
        }
    });

} 

function listUserPosts(data){
    
    const root = document.querySelector("#root");
   
    const main = document.createElement("main");
    root.appendChild(main);
    main.setAttribute("role", "main");
    const feed = document.createElement("ul");
    main.appendChild(feed);
    feed.id = "feed";
    feed.setAttribute("data-id-feed", "");

        

    // list user's posts
    for(const item of data){
        const li = document.createElement('li');
        feed.appendChild(li);
        li.className = "post";
        li.setAttribute("data-id-post", "");
        
        const vote = document.createElement("div");
        li.appendChild(vote);
        vote.className = "vote";
        const up = document.createElement("img");
        up.src = "images/up.svg";
        up.className = 'pic';
        up.classList.add('up-votes');
        vote.appendChild(up);


        const num = document.createElement("p");
        vote.appendChild(num);
        num.className = 'vppl';
        num.setAttribute("data-id-upvotes", "");
        num.textContent = item.meta.upvotes.length;
        
        // get who upvotes cur feed
        num.addEventListener('click', function(){
            show_upvotes(item.meta.upvotes);
        }, false);


        const down = document.createElement("img");
        down.src = "images/down.svg";
        down.className = 'pic';
        down.classList.add('down-votes');
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

        // show comments
        comments.addEventListener('click', function(){
            show_comments(item.comments);
        }, false);
        
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

}

function display(feed, item){
    const li = document.createElement('li');
    feed.appendChild(li);
    li.className = "post";
    li.setAttribute("data-id-post", "");

    const vote = document.createElement("div");
    li.appendChild(vote);
    vote.className = "vote";
    const up = document.createElement("img");
    up.src = "images/up.svg";
    up.className = 'pic';
    up.classList.add('up-votes');
    vote.appendChild(up);

    // up vote
    up.addEventListener('click', function(e){
        up_vote(e, item);
    }, false);

    const num = document.createElement("p");
    vote.appendChild(num);
    num.className = 'vppl';
    num.setAttribute("data-id-upvotes", "");
    num.textContent = item.meta.upvotes.length;

    // get who upvotes cur feed
    num.addEventListener('click', function(){
        show_upvotes(item.meta.upvotes);
    }, false);


    const down = document.createElement("img");
    down.src = "images/down.svg";
    down.className = 'pic';
    down.classList.add('down-votes');
    vote.appendChild(down);


    // down vote
    down.addEventListener('click', function(e){
        down_vote(e, item);
    }, false);

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

    // show comments
    comments.addEventListener('click', function(){
        show_comments(item.comments);
    }, false);

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


export { getFeeds, listUserPosts };
