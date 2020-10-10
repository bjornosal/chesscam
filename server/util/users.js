const generator = require("./usernameGenerator");

const users = {};

async function randomID() {
    let id = generator.createUsername();
    while (id in users) {
        await Promise.delay(5);
        id = generator.createUsername();
    }
    return id;
}

exports.create = async (socket) => {
    const id = await randomID();
    users[id] = socket;
    return id;
};

exports.get = (id) => users[id];

exports.remove = (id) => delete users[id];
