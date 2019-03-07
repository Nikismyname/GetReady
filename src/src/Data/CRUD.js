export const fetchRoot = "https://localhost:44342/api/";

function request(method) {
    let shouldConsoleLog = true;
    return async function (path, data = null, options = {}) {
        if (path.startsWith("/")) {
            path = path.slice(1);
        }

        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1);
        }

        let body = {};

        if (method.toLowerCase() === "get" && data !== null) {
            path = path + "/" + data;
            data = {};
        } else if(method.toLowerCase() !== "get") {
            body = { body: JSON.stringify(data) };
        }

        let fullPath = fetchRoot + path;

        let Authorization = "";
        let token = localStorage.getItem("token");
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
            ...body,
            ...options,
        });

        if (shouldConsoleLog) {
            console.log("PRE JSON RESULT");
            console.log(result);
        }

        ///For the cases when we send empty Ok() responses
        let json;
        try {
            json = await result.json();
        } catch{
            json = "No Body";
        }
        ///...
        
        if (shouldConsoleLog) {
            console.log("JSON RESULT");
            console.log(json);
        }

        if (result.status === 200) {
            return { status: 200, data: json };
        } else if (result.status === 400) {
            return { status: 400, message: json };
        } else {
            return {status: 500, result, json}
        }
    }
}

export const get = request("GET");
export const post = request("POST");
export const put = request("PUT");
export const remove = request("DELETE");