const settingsModel = require("@models/settings");

class Setting {

    async index(req, res) {
        const configs = await settingsModel.findAll();

        const presentedConfigs = {};
        configs.forEach(setting => {
            presentedConfigs[setting.setting_name] = isNaN(setting.setting_value) ? setting.setting_value : +setting.setting_value;
        });

        res.adminRender("admin/settings/index", { layout: "admin", configs: presentedConfigs });
    };


    async store(req, res) {
        const settings = req.body;

        const postData = {
            'web_title': settings["web_title"],
            'web_description': settings["web_description"],
            'posts_per_page': settings["posts_per_page"],
            'allow_users_comments': settings["allow_users_comments"] || '0',
            'allow_users_register': settings["allow_users_register"] || '0'
        };

        const result = await settingsModel.update(postData);
        !result && req.flash("errors", "خطا در بروزرسانی تنظیمات");
        result && req.flash("success", "تنظیمات با موقفیت بروزرسانی شد.");
        res.status(200).redirect("/admin/settings");
    };
};

module.exports = new Setting();