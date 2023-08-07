const dateServices = require("@services/date");

class PostPresenter {
    constructor(post) {
        this.post = post;
    };

    jalaliCreatedAt() {
        return dateServices.toPersianDate(this.post.created_at);
    };

    excerpt(wordsLimit = 20) {
        const splittedContent = this.post.intro.split(" ");
        const excerptedContent = splittedContent.slice(0, wordsLimit).join(" ");
        return excerptedContent;
    };
};

module.exports = PostPresenter;