function userMainPage(username){
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
    hello.textContent = ('Hi, ' + username);
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


}


export { userMainPage };
