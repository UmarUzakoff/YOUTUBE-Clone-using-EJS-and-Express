class Post {
  constructor(id, video, userAvatar, title, username, postedDate, views = 0, likes = 0, dislikes = 0, user_id) {
    this.id = id;
    this.video = video;
    this.userAvatar = userAvatar;
    this.title = title;
    this.username = username;
    this.postedDate = postedDate;
    this.views = views;
    this.likes = likes;
    this.dislikes = dislikes;
    this.user_id = user_id;
  }
}

module.exports = Post;