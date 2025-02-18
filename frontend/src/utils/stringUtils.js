const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const Lowercase = (str) => {
    return str.toLowerCase();
};

export { Capitalize, Lowercase };
