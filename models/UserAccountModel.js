export var UserAccount = function(username, phone, email, userID) {
    this.account = {
        userID: userID,
        username: username,
        phone: phone,
        email: email
    }
}