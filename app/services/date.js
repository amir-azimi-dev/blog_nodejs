const jm = require("jalali-moment");

exports.toPersianDate = (date, format="YYYY/MM/DD", locale="fa") => {
    return jm(date).locale(locale).format(format);
};