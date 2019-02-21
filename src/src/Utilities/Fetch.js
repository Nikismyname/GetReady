import * as c from "./Constants";

export function GET(path) {
    if (path.startsWith("/"))
    {
        path = path.slice(1);
    }

    return fetch(c.fetchRoot + path, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
}

export function POST(path, payload) {
    if (path.startsWith("/")) {
        path = path.slice(1);
    }

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    let token = localStorage.getItem("token");
    if (token !== null) {
        headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    }

    return fetch(c.fetchRoot + path, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
    });
}