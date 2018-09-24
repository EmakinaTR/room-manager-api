const mappedList = JSON.parse(process.env.USER_MAP);

function getUserList() {

    mappedList.forEach(element => {
        delete element["email"];
    });

    return mappedList;

}

function getUserById(id, callback) {

    var user = mappedList.filter(item => item.id == id)[0];

    if (user == undefined)
        callback("The user " + id + " does not exist.");
    else
        callback(null, user);

}

module.exports = {
    getUserList,
    getUserById
}