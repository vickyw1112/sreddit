import {confirm_code, update_auth, confirm_response_looks_like, reset, looks_like_feed} from './globals.js';

describe('API tests - User Endpoints', function() {
    const jeff = {
        username: `TESTERELLA${Date.now()}`,
        password: 'GoldblumSecure',
        name: 'Jeff',
        email: 'jeff@jurassicparklovers.com'
    }
    const jeff2 = {
        username: `TESTERELLA2${Date.now()}`,
        password: 'GoldblumSecure',
        name: 'Jeff',
        email: 'jeff@jurassicparklovers.com'
    }
    const maryLogin = {
        username: 'Mary',
        password: 'cents_caught'
    }
    const mary = {
        "username": "Mary",
        "name": "Mary",
        "id": 3,
        "email": "Mary@unsw.edu.au",
        "following": true,
        "followed_num": true,
        "posts": true,
    }
    
    const patricia = {
        "username": "Patricia",
        "name": "Patricia",
        "id": 5,
        "email": "Patricia@unsw.edu.au",
        "following": true,
        "followed_num": true,
        "posts": true
    }

    const check_randomised_fields = (o) => {
        let following = false;
        let followed_num = false;
        let posts = false;
        if (Array.isArray(o.following))
            following = o.following.reduce((acc,val) => acc && Number.isInteger(val), true)
        if (Number.isInteger(o.followed_num))
            followed_num = (o.followed_num >= 0)
        if (Array.isArray(o.posts))
            posts = o.posts.reduce((acc,val) => acc && Number.isInteger(val), true)
        return {
            ...o,
            following,
            followed_num,
            posts
        }
    }
    const put_flags = {
        auth: 'put_user'
    }
    let test;
    
    describe('GET user', function() {
        // all of GET /user
        it('returns a 403 on get user without auth',
            () => confirm_code(`user`, 'GET', null, 403));
        it('allows a valid log in request',
            () => update_auth(maryLogin));
        it('returns current logged in users details on get user',
            () => confirm_response_looks_like(`user`, 'GET', null, mary, {processFunction: check_randomised_fields}));
        it('returns 400 on get user with invalid id',
            () => confirm_code(`user?id=abc`, 'GET', null, 400));
        it('returns 400 on get user with nonexistant id',
            () => confirm_code(`user?id=123456789`, 'GET', null, 400));
        it('returns another users details correctly',
            () => confirm_response_looks_like(`user?id=5`, 'GET', null, patricia, {processFunction: check_randomised_fields}));
        
        after(reset);
    });
    
    describe('PUT user', function() {
        it('allows a valid sign up request', () => confirm_code(`auth/signup`, 'POST', jeff, 200))
        it('allows a valid log in request',
            () => update_auth({username: jeff.username, password: jeff.password}, 'put_user'));
        
        it('allows a valid get user request',
            () => confirm_code(`user`, 'GET', null, 200, put_flags).then(r => r.json).then(r=> test = r));
    
        it('returns a 400 on empty put user',
            () => confirm_code(`user`, 'PUT', {}, 400, put_flags));
        
        it('allows you to update your own name',
            () => confirm_code(`user`, 'PUT', {name: 'bob'}, 200, put_flags)
                .then(confirm_response_looks_like(`user`, 'GET', null, {...test, name: 'bob'}, put_flags))
            );
        it('allows you to update your own email',
            () => confirm_code(`user`, 'PUT', {email: 'lol'}, 200, put_flags)
                .then(confirm_response_looks_like(`user`, 'GET', null, {...test, name: 'bob', email: 'lol'}, put_flags))
            );
        it('allows you to update your own password',
            () => confirm_code(`user`, 'PUT', {password: '123'}, 200, put_flags)
                .then(confirm_code(`auth/login`, 'POST', {username: test.username, password: '123'}, 200, put_flags))
            );
        it('allows you to update multiple fields',
            () => confirm_code(`user`, 'PUT', {name: 'boberella', email: 'lmao'}, 200, put_flags)
                .then(confirm_response_looks_like(`user`, 'GET', null, {...test, name: 'boberella', email: 'lmao', password: '123'}, put_flags))
            );
        it('returns a 400 if you try to update your password to be empty',
            () => confirm_code(`user`, 'PUT', {password: ''}, 400, put_flags)
        );

        after(reset);
    });

    // all of GET /user/feed

    describe('GET user/feed', function() {
        it('returns correct feed with no params',
            () => looks_like_feed(`user/feed`))
        it('returns 400 on invalid n',
            () => confirm_code(`user/feed?n=abc`, 'GET', null, 400))
        it('returns 400 on invalid p',
            () => confirm_code(`user/feed?p=abc`, 'GET', null, 400))
        it('returns 400 on too small n',
            () => confirm_code(`user/feed?n=0`, 'GET', null, 400)
                    .then(() => confirm_code(`user/feed?n=-1`, 'GET', null, 400))
        );
        it('returns 400 on too small p',
            () => confirm_code(`user/feed?p=0`, 'GET', null, 200)
                    .then(() => confirm_code(`user/feed?p=-1`, 'GET', null, 400))
        );

        it('returns correct feed with supplied n',
            () => looks_like_feed(`user/feed?n=5`))
        it('returns correct feed with supplied p',
            () => looks_like_feed(`user/feed?p=1`))
        it('returns correct feed with supplied n and p',
            () => looks_like_feed(`user/feed?n=4&p=2`))
        it('returns correct feed with n > 10 and p',
            () => looks_like_feed(`user/feed?n=15&p=1`))
        it('returns correct feed with supplied n < 10 and p',
            () => looks_like_feed(`user/feed?n=8&p=2`))

        after(reset);
    });

    describe('PUT user/follow and user/unfollow', function() {
        it('allows a valid sign up request', () => confirm_code(`auth/signup`, 'POST', jeff, 200))
        it('allows a valid log in request',
            () => update_auth({username: jeff.username, password: jeff.password}, 'put_user'));
        it('returns 400 on user follow with missing username',
            () => confirm_code(`user/follow`, 'PUT', null, 400))
        it('returns 400 on user follow with nonexistant username',
            () => confirm_code(`user/follow?username=fsdfssfs`, 'PUT', null, 400))
        it('returns 400 on self follow',
            () => confirm_code(`user/follow?username=Mary`, 'PUT', null, 400))
        it('returns 200 on valid sign up',
            () => confirm_code(`auth/signup`, 'POST', jeff2, 200))
        it('returns 200 on user follow with valid username',
            () => confirm_code(`user/follow?username=${jeff2.username}`, 'PUT', null, 200, put_flags));
        it('returns 200 on double follow with valid username',
            () => confirm_code(`user/follow?username=${jeff2.username}`, 'PUT', null, 200, put_flags));
        it('updates own following list after user follow',
            () => update_auth(jeff2, 'jeff2')
                .then(() => confirm_code(`user`, 'GET', null, 200, {auth: 'jeff2'}))
                .then((r) => r.json())
                .then((r) => confirm_response_looks_like(`user`, 'GET', null, [r.id], {
                    ...put_flags,
                    processFunction: (x) => x.following
                }))
        );
        it('updates followed count after user follow',
            () => update_auth(jeff2, 'jeff2')
            .then(() => confirm_code(`user`, 'GET', null, 200, {auth: 'jeff2'}))
            .then((r) => r.json())
            .then((r) => chai.expect(r.followed_num).to.equal(1))
        );
        it('returns 400 on user unfollow with missing username',
            () => confirm_code(`user/unfollow`, 'PUT', null, 400))
        it('returns 400 on user unfollow with nonexistant username',
            () => confirm_code(`user/unfollow?username=fsdfssfs`, 'PUT', null, 400))
        it('returns 400 on self unfollow',
            () => confirm_code(`user/unfollow?username=Mary`, 'PUT', null, 400))
        it('returns 200 on user unfollow with valid username',
            () => confirm_code(`user/unfollow?username=${jeff2.username}`, 'PUT', null, 200, put_flags));
        it('returns 200 on double user unfollow with valid username',
            () => confirm_code(`user/unfollow?username=${jeff2.username}`, 'PUT', null, 200, put_flags));
        it('updates own following list after user unfollow',
            () => update_auth(jeff2, 'jeff2')
                .then(() => confirm_code(`user`, 'GET', null, 200, {auth: 'jeff2'}))
                .then((r) => r.json())
                .then((r) => confirm_response_looks_like(`user`, 'GET', null, [], {
                    ...put_flags,
                    processFunction: (x) => x.following
                }))
        );
        
        it('updates followed count after user unfollow',
            () => update_auth(jeff2, 'jeff2')
            .then(() => confirm_code(`user`, 'GET', null, 200, {auth: 'jeff2'}))
            .then((r) => r.json())
            .then((r) => chai.expect(r.followed_num).to.equal(0))
        );
        
        after(reset);
    });
})
