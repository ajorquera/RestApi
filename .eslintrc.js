module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "indent": ["error", "tab"],
        "no-tabs": 0,
        "no-underscore-dangle": [2, { "allowAfterThis": true }],
        "object-curly-newline": ["error", {
            "ObjectPattern": { "multiline": true },
        }],
        "comma-dangle": ["error", "never"],
        
    }
};