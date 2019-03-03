export const fetchRoot = "https://localhost:44342/api/";

function request(method) {
    return async function (path, data = {}, shouldConsoleLog = false, options = {}) {
        if (path.startsWith("/")) {
            path = path.slice(1);
        }

        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1);
        }

        let body = null;
        if (method.toLowerCase() === "get" && data !== {}) {
            path = path + "/" + data;
            data = {};
        } else {
            body = JSON.stringify(data);
        }

        let fullPath = fetchRoot + path;

        let Authorization = "";
        let token = localStorage.getItem(token);
        if (token !== null) {
            Authorization = `Bearer ${token}`
        }

        let result = await fetch(fullPath, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization,
            },
            body,
            ...options,
        });

        if (shouldConsoleLog) {
            console.log("PRE JSON RESULT");
            console.log(result);
        }

        let json = await result.json();
        if (shouldConsoleLog) {
            console.log("JSON RESULT");
            console.log(json);
        }

        if (result.status === 200) {
            return { status: 200, data: json };
        } else if (result.status === 400) {
            return { status: 400, message: json };
        }

        return json;
    }
}

export const get = request("GET");
export const post = request("POST");
export const put = request("PUT");
export const remove = request("DELETE");