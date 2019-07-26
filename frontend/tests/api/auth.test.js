import {confirm_code, confirm_response_has_keys, reset} from './globals.js';

describe('API tests - Auth Endpoints', function() {
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

    const anon = {
        username: 'Anon',
        password: 'password'
    }

    const mary = {
        username: 'Mary',
        password: 'cents_caught'
    }

    describe('Signup', function() {
        it('allows a valid sign up request',
            () => confirm_code(`auth/signup`, 'POST', jeff, 200));
        it('returns a 400 on sign up with missing username',
            () => confirm_code(`auth/signup`, 'POST', {...jeff, username:undefined}, 400));
        it('returns a 400 on sign up with missing password',
            () => confirm_code(`auth/signup`, 'POST', {...jeff, password:undefined}, 400));
        it('returns a 400 on sign up with missing name',
            () => confirm_code(`auth/signup`, 'POST', {...jeff, name:undefined}, 400));
        it('returns a 400 on sign up with missing email',
            () => confirm_code(`auth/signup`, 'POST', {...jeff, email:undefined}, 400));
        it('returns a 400 on sign up with 2 missing params',
            () => confirm_code(`auth/signup`, 'POST', {...jeff, email:undefined, password:undefined}, 400));
        it('returns a 400 on sign up with 3 missing params',
            () => confirm_code(`auth/signup`, 'POST', {...jeff, username: undefined, email:undefined, password:undefined}, 400));
        it('returns a 400 on sign up with no params',
            () => confirm_code(`auth/signup`, 'POST', {}, 400));
        it('returns a 409 on sign up with existing username',
            () => confirm_code(`auth/signup`, 'POST', jeff, 409));
        it('returns a 400 on sign up with empty username',
            () => confirm_code(`auth/signup`, 'POST', {...jeff2, username: ''}, 400));
        it('returns a 400 on sign up with empty password',
            () => confirm_code(`auth/signup`, 'POST', {...jeff2, password: ''}, 400));
        it('returns a auth token on valid signup',
            () => confirm_response_has_keys(`auth/signup`, 'POST', jeff2, ['token']));

        after(reset);
    });

    describe('Signup', function() {
        it('allows a valid Anon log in request',
            () => confirm_code(`auth/login`, 'POST', anon, 200));
        it('allows a valid log in request',
            () => confirm_code(`auth/login`, 'POST', mary, 200));
        it('returns a 400 on log in with no username',
            () => confirm_code(`auth/login`, 'POST', {...anon, username:undefined}, 400));
        it('returns a 400 on log in with no password',
            () => confirm_code(`auth/login`, 'POST', {...anon, password:undefined}, 400));
        it('returns a 403 on log in with invalid pass',
            () => confirm_code(`auth/login`, 'POST', {...anon, password:'wowe'}, 403));

        after(reset);
    });
})