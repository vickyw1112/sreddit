import API_URL from './backend_url.js'
import { userMainPage } from './helper.js'
function getFeeds(token, username){

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
        console.log(data);
        console.log(token);
        userMainPage(username, token);
        
        const feed = document.querySelector("#feed");
        // if no posts
        if(!data.posts.length){
            const notice = document.createElement('div');
            feed.appendChild(notice);
            notice.id = "notice";
            notice.textContent = "you didn't have any posts yet";
        }

        else{
            // list user's feeds
            for(const item of data.posts){
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
                vote.appendChild(up);

                const num = document.createElement("p");
                vote.appendChild(num);
                num.className = 'vppl';
                num.setAttribute("data-id-upvotes", "");
                num.textContent = item.meta.upvotes.length;
                
                // get who upvotes cur feed
                num.addEventListener('click', function(){
                    var upVotes = new Array(item.meta.upvotes);
                    console.log(upVotes);
                    show_upvotes(token, upVotes[0]);
                }, false);


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
 
        }
    
    })
    .catch(e => console.error('Error:', e));
}

function show_upvotes(token, users){
    var urls = [];
    users.forEach(e =>{
        var url = API_URL + '/user/?id=' + e;
        urls.push(url); 
    });
    
    console.log(users);
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
        .catch(e => console.log('Error:' + e))
    ))
    .then(data => {
        console.log(data);
        for(const usr of data){
            const li = document.createElement('li');
            ul.appendChild(li);
            li.textContent = usr.username;
            li.className = 'ppl-list';
        } 
    });
}


export { getFeeds };
