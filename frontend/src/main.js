/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.

import { initMainPage, initLogin, initSignup, displayFeed } from './init.js'
function initApp(apiUrl) {

    initMainPage();
    initLogin(); 
    initSignup(); 
}


export default initApp;
