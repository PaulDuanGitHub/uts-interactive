var url = "";
var isSocket = false;
if (window.location.origin == "http://127.0.0.1:3000" || window.location.origin == "http://localhost:3000"){
    url = "http://127.0.0.1:8888"
    // url = "https://api.paulduan.tk/round-table"
}else if (window.location.origin == "https://paulduangithub.github.io"){
    url = "https://api.xianzhaoduan.com/uts-interactive"
    isSocket = true
}
// isSocket = true

export {url, isSocket};