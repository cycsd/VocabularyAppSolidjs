const fetchGet = (
    path: string,
    setUrl: (url: URL) => URL = url => url) => {
    let url = setUrl(new URL(path));
    return fetch(url.toString())
}

function fetchPost<T>(
    path: string,
    data: T) {
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    const f = fetch(
        path,
        {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        }
    )
    return f
}
function ResponseOk(res: Response) {
    if (res.ok) {
        return res.json()
    }
    else { throw new Error(res.statusText); }
}

export { fetchGet, fetchPost, ResponseOk }