// Assumes api is running on localhost:5000
export const API_URL = 'http://localhost:5000';

let auth_tokens = {};

export function confirm_code(url, method, body, code, flags) {
    const headers =  {
        'Content-Type': 'application/json'
    }
    const options = {
        method,
        headers
    }
    if(!flags) flags = {}
    const namespace = flags.auth || 'default';
    const auth_token = auth_tokens[namespace]
    if (auth_token) headers['Authorization'] = `Token ${auth_token}`
    if (method !== 'GET') options.body = JSON.stringify(body)

    return fetch(`${API_URL}/${url}`, options)
        .then(response => {
            chai.expect(response.status).to.equal(code);
            return response;
        })
}

export function confirm_response_has_keys(url, method, body, keys, flags) {
    if(!flags) flags = {}
    const namespace = flags.auth || 'default';
    if (!namespace) namespace = 'default';

    const headers =  {
        'Content-Type': 'application/json'
    }
    const options = {
        method,
        headers
    }
    const auth_token = auth_tokens[namespace]
    if (auth_token) headers['Authorization'] = `Token ${auth_token}`
    if (method !== 'GET') options.body = JSON.stringify(body)

    return fetch(`${API_URL}/${url}`, options)
        .then(r => r.json())
        .then(r => {
            keys.forEach(k => chai.expect(r).to.have.property(k))
        })
}

export function confirm_response_looks_like(url, method, body, obj, flags) {
    if(!flags) flags = {}
    const namespace = flags.auth || 'default';
    const f = flags.processFunction || null;

    if (!namespace) namespace = 'default';
    const auth_token = auth_tokens[namespace]
    const headers =  {
        'Content-Type': 'application/json'
    }
    const options = {
        method,
        headers
    }

    if (auth_token) headers['Authorization'] = `Token ${auth_token}`
    if (method !== 'GET') options.body = JSON.stringify(body)

    return fetch(`${API_URL}/${url}`, options)
        .then(r => {
            chai.expect(r.status).to.equal(200)
            return r.json()
        })
        .then(r => {
            if (f) {
                chai.expect(f(r)).to.eql(obj)
            }
            else {
                chai.expect(r).to.eql(obj)
            }
        })
}

export function update_auth(creds, namespace) {
    if (!namespace) namespace = 'default';

    return fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(creds),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(r => {
        chai.expect(r.status).to.equal(200)
        return r.json()
    })
    .then(r => {
        auth_tokens[namespace] = r.token
    })
}

export function reset() {
    fetch(`${API_URL}/soft-reset`);
}

export function looks_like_feed(endpoint, namespace = 'default') {
    
    return fetch(`${API_URL}/${endpoint}`, {
        headers: {
            'Authorization': `Token ${auth_tokens[namespace]}`
        }
    })
    .then(r => r.json())
    .then(r => {
        chai.expect(r).to.have.property("posts")
        for(const post of r.posts) {
            chai.expect(post).to.have.property("id");
            chai.expect(post).to.have.property("title");
            chai.expect(post).to.have.property("comments");
            chai.expect(post).to.have.property("image");
            chai.expect(post).to.have.property("thumbnail");
            chai.expect(post).to.have.property("text");
            chai.expect(post).to.have.property("meta");
            chai.expect(post.meta).to.have.property("subseddit");
        }
    })
}