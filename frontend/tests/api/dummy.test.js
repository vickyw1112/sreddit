import {confirm_code, confirm_response_has_keys, reset} from './globals.js';

describe('API tests - Dummy Endpoints', function() {
  const text_post = {
    description_text: 'test',
    src: '',
  }

  const edited_text_post = {
    description_text: 'test with an edit',
    src: '',
  }

  const long_text_post = {
    description_text: 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest',
    src: '',
  }

  const malformed_text_post = {
    description_text: '',
    src: '',
  }

  const malformed_text_post_only_has_src = {
    description_text: '',
    src: 'example image content'
  }

  const sample_comment = {
    comment: 'all of your sample comments are belong to us',
  }

  const mary = {
      username: 'Mary',
      password: 'cents_caught'
  }

  describe('/post',  function() {
    it('returns 200 when submitting post with text',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200));
    it('returns 200 when submitting post with a larger amount of text',
        () => confirm_code(`dummy/post/`, 'POST', long_text_post, 200));
    it('returns 400 when submitting post with empty text and empty src',
        () => confirm_code(`dummy/post/`, 'POST', malformed_text_post, 400));
    it('returns 400 when submitting post with empty text and non-empty src',
        () => confirm_code(`dummy/post/`, 'POST', malformed_text_post, 400));
    it('returns 200 when editing a post that was created by the dummy user',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/?id=` + resp.post_id, 'PUT', edited_text_post, 200)));
    it('returns 400 when attempting to edit a non-existent post as the dummy user',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/?id=9999`, 'PUT', edited_text_post, 400)));
    it('returns 400 when attempting to delete a post that does not exist',
        () => confirm_code(`dummy/post/`, 'DELETE', {}, 400));
    it('returns 200 when attempting to delete a post that exists',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/?id=` + resp.post_id, 'DELETE', {}, 200)));
    it('returns 200 when attempting to delete a post that has been edited after creation',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/?id=` + resp.post_id, 'PUT', long_text_post, 200)
                        .then(() => confirm_code(`dummy/post/?id=` + resp.post_id, 'DELETE', {}, 200))));
    it('returns 200 when attempting to get a post that exists',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/?id=` + resp.post_id, 'GET', {}, 200)));
    it('returns a 400 when attempting to get a post that does not exist',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/?id=` + resp.post_id, 'GET', {}, 200)));
    it('returns a 400 when attempting to upvote a post that does not exist',
        () => confirm_code(`dummy/post/vote/?id=9999`, 'PUT', {}, 400)); 
    it('returns a 200 when attempting to upvote a post that exists',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/vote/?id=` + resp.post_id, 'PUT', {}, 200)));
    it('returns a 200 when attempting to remove an upvote from a previously upvoted post',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/vote/?id=` + resp.post_id, 'PUT', {}, 200)
                    .then(() => confirm_code(`dummy/post/vote/?id=` + resp.post_id, 'DELETE', {}, 200))));
    it('returns a 400 when attempting to remove an upvote from a post which has not previously been upvoted by the same user',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/vote/?id=` + resp.post_id, 'DELETE', {}, 400)));
    it('returns a 200 when commenting on an existing post',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/comment/?id=` + resp.post_id, 'PUT', sample_comment, 200)));
    it('returns a 200 when commenting multiple times on an existing post',
        () => confirm_code(`dummy/post/`, 'POST', text_post, 200)
                .then(resp => resp.json())
                .then(resp => confirm_code(`dummy/post/comment/?id=` + resp.post_id, 'PUT', sample_comment, 200)
                .then(() => confirm_code(`dummy/post/comment/?id=` + resp.post_id, 'PUT', sample_comment, 200))));
    it('returns a 400 when commenting on a post that does not exist',
        () => confirm_code(`dummy/post/comment/?id=9999`, 'PUT', sample_comment, 400));
    
    after(reset);
  })
  describe('/user',  function() {
    it('returns a 200 when requesting user information of an existing user',
        () => confirm_response_has_keys(`dummy/user/?id=1`, 'GET', {}, ['username', 'name', 'id', 'email', 'following', 'followed_num', 'posts']));
    it('returns a 400 when requesting user information of some user which does not exist',
        () => confirm_code(`dummy/user/?id=9999`, 'GET', {}, 400));
    it('returns a 200 when updating the anonymous user email information',
        () => confirm_code(`dummy/user/?id=1`, 'PUT', { email: 'test@test.com' }, 200));
    it('returns a 200 when updating the anonymous user name',
        () => confirm_code(`dummy/user/?id=1`, 'PUT', { name: 'Test User' }, 200));
    it('returns a 200 when updating the anonymous user password',
        () => confirm_code(`dummy/user/?id=1`, 'PUT', { password: 'correct horse battery staple' }, 200));
    it('returns a 400 when attempting to update the anonymous user password with an empty string',
        () => confirm_code(`dummy/user/?id=1`, 'PUT', { password: '' }, 400));
    it('returns a 200 when attempting to retrieve the beginning of the post feed',
        () => confirm_response_has_keys(`dummy/user/feed/`, 'GET', {}, ['posts']));
    it('returns a 200 when attempting to retrieve some slice of the post feed',
        () => confirm_response_has_keys(`dummy/user/feed/?p=5&n=15`, 'GET', {}, ['posts']));
    it('returns a 200 when following another user as the anonymous user',
        () => confirm_code(`dummy/user/follow/?username=` + mary.username, 'PUT', {}, 200));
    it('returns a 400 when attempting to follow a user that does not exist',
        () => confirm_code(`dummy/user/follow/?username=abcdef123456`, 'PUT', {}, 400));
    it('returns a 400 when no username to follow is provided',
        () => confirm_code(`dummy/user/follow/`, 'PUT', {}, 400));
    it('returns a 400 when attempting to follow the currently logged-in user',
        () => confirm_code(`dummy/user/follow/?username=Anon`, 'PUT', {}, 400));
    it('returns a 200 when unfollowing a user that the current user already follows',
        () => confirm_code(`dummy/user/unfollow/?username=` + mary.username, 'PUT', {}, 200));
    it('returns a 400 when attempting to unfollow the currently logged-in user',
        () => confirm_code(`dummy/user/follow/?username=Anon`, 'PUT', {}, 400));
    it('returns a 400 when no username to unfollow is provided',
        () => confirm_code(`dummy/user/unfollow/`, 'PUT', {}, 400));
    
    after(reset);
  })
})
