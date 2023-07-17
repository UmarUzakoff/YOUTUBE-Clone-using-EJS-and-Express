class User{
    constructor(id, username, password, avatar, followers = 0) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.avatar = avatar;
        this.followers = followers;
    }
}

module.exports = User;