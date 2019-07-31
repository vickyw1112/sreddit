import {confirm_code, update_auth, reset, looks_like_feed} from './globals.js';

describe('API tests - Post endpoints', function() {
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
    const text_post = {
        text: 'test',
        image: '',
        title: 'test title',
        subseddit: '',
    }

    const edited_text_post = {
        text: 'test with an edit',
    }

    const long_text_post = {
        text: 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest',
        image: '',
        title: 'test title',
        subseddit: '',
    }

    const edited_long_text_post = {
        title: 'this is a title for a long post'
    };

    const malformed_text_post = {
        text: '',
        image: '',
        title: 'test title',
        subseddit: '',
    }

    const malformed_text_post_only_has_image = {
        text: '',
        image: 'example image content',
        title: '',
        subseddit: '',
    }

    const sample_comment = {
        comment: 'all of your sample comments are belong to us',
    }

    const put_flags = {
        auth: 'put_user'
    }

  describe('/post',  function() {
    it('allows a valid sign up request', () => confirm_code(`auth/signup`, 'POST', jeff, 200))
    it('allows a valid log in request',
        () => update_auth({username: jeff.username, password: jeff.password}, 'put_user'));
    it('returns 200 when submitting post with text',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags));
    it('returns 200 when submitting post with a larger amount of text',
        () => confirm_code(`post/`, 'POST', long_text_post, 200, put_flags));
    it('returns 400 when submitting post with empty text and empty image',
        () => confirm_code(`post/`, 'POST', malformed_text_post, 400, put_flags));
    it('returns 400 when submitting post with empty text and non-empty image',
        () => confirm_code(`post/`, 'POST', malformed_text_post, 400, put_flags));
    it('returns 200 when editing a post that was created by the dummy user',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/?id=` + resp.post_id, 'PUT', edited_text_post, 200, put_flags)));
    it('returns 400 when attempting to edit a non-existent post as the dummy user',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/?id=9999`, 'PUT', edited_text_post, 400, put_flags)));
    it('returns 400 when attempting to delete a post that does not exist',
        () => confirm_code(`post/`, 'DELETE', {}, 400, put_flags));
    it('returns 200 when attempting to delete a post that exists',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/?id=` + resp.post_id, 'DELETE', {}, 200, put_flags)));
    it('returns 200 when attempting to delete a post that has been edited after creation',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/?id=` + resp.post_id, 'PUT', edited_long_text_post, 200, put_flags)
                        .then(() => confirm_code(`post/?id=` + resp.post_id, 'DELETE', {}, 200, put_flags))));
    it('returns 200 when attempting to get a post that exists',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/?id=` + resp.post_id, 'GET', {}, 200, put_flags)));
    it('returns a 400 when attempting to get a post that does not exist',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/?id=` + resp.post_id, 'GET', {}, 200, put_flags)));
    it('returns a 400 when attempting to upvote a post that does not exist',
        () => confirm_code(`post/vote/?id=9999`, 'PUT', {}, 400, put_flags)); 
    it('returns a 200 when attempting to upvote a post that exists',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/vote/?id=` + resp.post_id, 'PUT', {}, 200, put_flags)));
    it('returns a 200 when attempting to remove an upvote from a previously upvoted post',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/vote/?id=` + resp.post_id, 'PUT', {}, 200, put_flags)
                    .then(() => confirm_code(`post/vote/?id=` + resp.post_id, 'DELETE', {}, 200, put_flags))));
    it('returns a 400 when attempting to remove an upvote from a post which has not previously been upvoted by the same user',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/vote/?id=` + resp.post_id, 'DELETE', {}, 400, put_flags)));
    it('returns a 200 when commenting on an existing post',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/comment/?id=` + resp.post_id, 'PUT', sample_comment, 200, put_flags)));
    it('returns a 200 when commenting multiple times on an existing post',
        () => confirm_code(`post/`, 'POST', text_post, 200, put_flags)
                .then(resp => resp.json())
                .then(resp => confirm_code(`post/comment/?id=` + resp.post_id, 'PUT', sample_comment, 200, put_flags)
                .then(() => confirm_code(`post/comment/?id=` + resp.post_id, 'PUT', sample_comment, 200, put_flags))));
    it('returns a 400 when commenting on a post that does not exist',
        () => confirm_code(`post/comment/?id=9999`, 'PUT', sample_comment, 400, put_flags));

    it('returns 200 when params are included in feed',
        () => looks_like_feed(`user/feed/?p=2&n=22`));
    it('returns 200 for /post/public',
        () => looks_like_feed(`post/public`));
    it('returns 200 for /used/feed',
        () => looks_like_feed(`user/feed`));
    
    after(reset);
  })
})
