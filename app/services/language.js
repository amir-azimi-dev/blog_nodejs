const numbers = ["۰", "۱","۲","۳","۴","۵","۶","۷","۸","۹"];

exports.numToPersian = input => {
    return String(input).split("").map(char => numbers[char] ? numbers[char]: char).join("");
};

console.log(this.numToPersian("you are 25."));  // you are ۲۵.