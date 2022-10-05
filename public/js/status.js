// fix status box on: edit user and edit bug page

fixStatus();
function fixStatus() {
    try {
        const myElement = document.getElementById('select_status');
        myElement.value = myElement.title;
    } catch (e) {
        console.log(e.message);
    }
}

fixBugPriority();
function fixBugPriority() {
    try {
        const myElement = document.getElementById('priority');
        myElement.value = myElement.title;
    } catch (e) {
        console.log(e.message);
    }
}
fixBugType();
function fixBugType() {
    try {
        const myElement = document.getElementById('type');
        myElement.value = myElement.title;
    } catch (e) {
        console.log(e.message);
    }
}
    