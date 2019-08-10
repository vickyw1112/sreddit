import API_URL  from './backend_url.js'
import { getFeeds } from './user.js'
import { userMainPage } from './helper.js'
var token = '';              
function validate_login(){
    const btns =  document.querySelectorAll(".login-button");
    for(const btn of btns){
        btn.addEventListener("click", () => {
            const forms = document.querySelectorAll("form");
            const last_form = forms.item(forms.length - 1);
            const error = last_form.children[1];
            const name = last_form.uname.value;
            const psd = last_form.psd.value;
            
            var payload = {
                username: name,
                password: psd
            };
            fetch(API_URL + '/auth/login', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(res.status == 400){
                    error.style.display = "block";
                    error.textContent = "Missing Username/Password";
                    throw new Error('400');
                }else if(res.status == 403){
                    error.style.display = "block";
                    error.textContent = "Invalid Username/Password";
                    throw new Error('403');
                }
                return res.json();
            })
            .then(data => {
                error.style.display = "none";
                token = data.token;
                document.body.removeChild(document.body.lastElementChild);
                
                // redirect to user home page
                // get feeds
                getFeeds(token, name);
                
            })
            .catch(e => console.error('Error:', e));
        });
    }
}

function validate_signup(){
    const btns =  document.querySelectorAll(".login-button");
    for(const btn of btns){
        btn.addEventListener("click", () => {
            const forms = document.querySelectorAll("form");
            const last_form = forms.item(forms.length - 1);
            const error = last_form.children[1];
            const name = last_form.uname.value;
            const psd = last_form.psd.value;
            const nn = last_form.nname.value;
            const email = last_form.emailadd.value;
            
            var payload = {
                username: name,
                password: psd,
                email: email,
                name: nn
            };
            fetch(API_URL + '/auth/signup', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(res.status == 400){
                    error.style.display = "block";
                    error.textContent = "Malformed Request";
                    throw new Error('400');
                }else if(res.status == 409){
                    error.style.display = "block";
                    error.textContent = "Username Taken";
                    throw new Error('409');
                }
                return res.json();
            })
            .then(data => {
                error.style.display = "none";
                token = data.token;
                document.body.removeChild(document.body.lastElementChild);
                 
                // redirect to user home page
                // get feeds
                getFeeds(token, name);
                
            })
            .catch(e => console.error('Error:', e));
        });
    }
}
       
function cancelForm(){
    const btns = document.querySelectorAll(".cancel-button");
    for(const btn of btns){
            btn.addEventListener("click", () => {
            const forms = document.querySelectorAll(".form-wrapper");
            const last_form = forms.item(forms.length - 1);
            document.body.removeChild(last_form) ;         
        }); 
    
    }       
 }   

export{ cancelForm, validate_login, validate_signup };

