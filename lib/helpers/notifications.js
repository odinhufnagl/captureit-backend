"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const admin = require("firebase-admin");
const sendNotification = async (tokens, notification, data) => {
    console.log(notification);
    try {
        console.log("tokens", tokens);
        if (!tokens || tokens.length === 0) {
            throw Error;
        }
        const payload = Object.assign({ notification }, (data ? { data: data } : {}));
        let res;
        for (let i = 0; i < 3; i++) {
            res = await admin
                .messaging()
                .sendToDevice(tokens, payload, {
                priority: "high",
            });
            if (res) {
                break;
            }
        }
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
};
exports.sendNotification = sendNotification;
//# sourceMappingURL=notifications.js.map