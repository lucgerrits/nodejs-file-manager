

function clear_input_path(input) {
    return input.replace(/\.\./gm, ""); //simple security
}

module.exports = {
	clear_input_path:clear_input_path
};
