const postsModel = require("@models/posts");

exports.postMethod = async (data, isNewPost = false) => {
    let errors = [];
    if (!data.title) {
        errors.push("عنوان مطلب نمی‌تواند خالی باشد")
    };
    if (!data.slug) {
        errors.push("نامک نمی‌تواند خالی باشد")
    } else {
        if (data.slug && isNewPost) {
            const reservedSlugs = await postsModel.findAllSlugs();
            const isRepeated = reservedSlugs.some(slug => slug.slug === data.slug);
            isRepeated && errors.push("نامک تکراری است");
        };
    };
    if (!data.intro) {
        errors.push("لطفا فیلد مقدمه‌ی مطلب را پر کنید")
    };
    if (!data.content) {
        errors.push("لطفا فیلد مطلب را پر کنید")
    };
    if (!data.author_id) {
        errors.push("لطفا نویسنده را انتخاب کنید")
    };
    return errors;
};