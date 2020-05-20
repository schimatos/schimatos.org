const addFiles = (files, text) => {

    const file = files.pop()

    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    if (file) {
        reader.onload = function (evt) {
            files.length > 0 ? addFiles(files, evt.target.result + text) : setState(evt.target.result + text)
    }} else {
    reader.onerror = function (evt) {
        console.log(evt)
    }}
}