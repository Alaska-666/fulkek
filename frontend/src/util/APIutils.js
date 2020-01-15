

export const ACCESS_TOKEN = "acessToken"


const request = (options, content_type='application/json', needStorage=true) => {
    const headers = new Headers({'Content-Type': content_type});

    if(localStorage.getItem(ACCESS_TOKEN) && needStorage) {
        headers.append('Authorization', 'JWT ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function getUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No token provided")
    }
    return request({
        url: "/current_user/",
        method: "GET"
    })
}

export function login(login, password) {
    return request({
        url: "/token_auth/",
        method: "POST",
        body: JSON.stringify({
            username: login,
            password: password,
        })
    })
}

export function signUp(login, password) {
    return request({
        url: "/users/",
        method: "POST",
        body: JSON.stringify({
            username: login,
            password: password,
        })
    }, 'application/json', false)
}

export function getTests() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No token provided")
    }
    return request({
        url: "/readall/",
        method: "GET",
    })
}

export function getTest(name) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No token provided")
    }
    return request({
        url: "/read?name=" + name ,
        method: "GET",

    })
}

export function getStat() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No token provided")
    }
    return request({
        url: "/sessions/",
        method: "GET",
    })
}

export function postStat(stat) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No token provided")
    }
    return request({
        url: "/session/",
        method: "POST",
        body: stat,
    })

}