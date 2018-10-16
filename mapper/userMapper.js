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

function getUsernameByEmail(email) {

    var user = mappedList.filter(item => item.email == email)[0];

    if (user == undefined)
        return null;
    else
        return user.name;

}

module.exports = {
    getUserList,
    getUserById,
    getUsernameByEmail
}