exports.postUserValidator = (data) => {
    let errors = [];
    if (!data.full_name) {
        errors.push("لطفا نام را وارد کنید ")
    };
    if (!data.email) {
        errors.push("ایمیل کاربر باید وارد شود")
    };
    if (!data.password) {
        errors.push("لطفا فیلد رمز عبور را پر کنید")
    };
    if (!data.role) {
        errors.push("لطفا نقش کاربر را انتخاب کنید")
    };

    return errors;
};

exports.updateUserValidator = (data, oldHashedUserPassword) => {
    let flag = 0;
    let errors = [];
    if (!data.full_name) {
        errors.push("لطفا نام را وارد کنید ");
        flag = 1
    };
    if (!data.email) {
        errors.push("ایمیل کاربر باید وارد شود");
        flag = 1
    };
    if (!data.role) {
        errors.push("لطفا نقش کاربر را انتخاب کنید");
        flag = 1
    };
    return errors;
};