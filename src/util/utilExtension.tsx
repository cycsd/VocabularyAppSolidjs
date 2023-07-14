const fetchGet = (
    path: string,
    setUrl: (url: URL) => URL = url => url) => {
    let url = setUrl(new URL(path));
    return fetch(url.toString())

}