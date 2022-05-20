import signupConfig from "../signup.config.mjs";
import {platform} from "./config/platform.mjs";
import {merge} from "./util/tool.mjs";
import * as api from './api/index.mjs';

// 开始
function start() {
    let usePlatform = signupConfig.platform || {};
    for (let name in usePlatform) {
        if (!api[name] || !platform[name]) {
            console.error(`${name}---该平台系统不支持`);
            continue
        }
        const script = api[name].default;
        if (Array.isArray(usePlatform[name])) {
            usePlatform[name].forEach(item => {
                script.init(merge(platform[name], item));
            })
        } else {
            script.init(merge(platform[name], usePlatform[name]));
        }
    }
}

start();