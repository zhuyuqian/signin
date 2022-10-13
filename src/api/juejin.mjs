import axios from 'axios';
import {SignUp} from "../util/SignUp.mjs";
import {sendEmailFromQQ} from "../util/sendEmail.mjs";
import {sendPush} from "../util/sendPush.mjs";

const sendMsg = async (title, content, platform) => {
    await sendEmailFromQQ(title, content, platform);
    await sendPush(title, content, platform)
}

const API = {
    "BASE": "https://api.juejin.cn",
    "GET_TODAY_STATUS": "/growth_api/v1/get_today_status",
    "CHECK_IN": "/growth_api/v1/check_in",
    "GET_LOTTERY_CONFIG": "/growth_api/v1/lottery_config/get",
    "DRAW_LOTTERY": "/growth_api/v1/lottery/draw",
    "ZYZ": "/growth_api/v1/lottery_lucky/dip_lucky",
    "GET_BUG_FIX": '/user_api/v1/bugfix/not_collect',
    "BUG_FIX": '/user_api/v1/bugfix/collect'
}

class JueJin extends SignUp {
    constructor(config) {
        super(config);
    }

    // bugfix
    async bugfix() {
        let {data} = await axios({url: API.BASE + API.GET_BUG_FIX, method: 'post', headers: {Cookie: this.cookie}});
        if (data.err_no) return await sendMsg(`今日掘金bugfix失败`, JSON.stringify(data), this);
        data.data.forEach(item => {
            axios({url: API.BASE + API.BUG_FIX, method: 'post', headers: {Cookie: this.cookie}, data: item});
        })
        return await sendMsg(`今日掘金bugfix：${data.data.length}`, JSON.stringify(data), this);
    }

    // 沾一沾
    async zyz() {
        let {data} = await axios({
            url: API.BASE + API.ZYZ,
            data: {lottery_history_id: '7099266502422954015'},
            method: 'post',
            headers: {Cookie: this.cookie}
        });
        if (data.err_no || data.data.has_dip) return;
        await this.zyz();
    }

    // 免费抽奖
    async draw() {
        let {error, isDraw} = await this.getTodayDrawStatus();
        if (error || isDraw) return;
        let {data} = await axios({url: API.BASE + API.DRAW_LOTTERY, method: 'post', headers: {Cookie: this.cookie}});
        if (data.err_no) return await sendMsg('今日免费抽奖：失败', JSON.stringify(data), this);
        await sendMsg(`恭喜抽到：${data.data.lottery_name}`, JSON.stringify(data), this);
    }

    // 获取当日免费抽奖次数
    async getTodayDrawStatus() {
        let {data} = await axios({
            url: API.BASE + API.GET_LOTTERY_CONFIG,
            method: 'get',
            headers: {Cookie: this.cookie}
        });
        if (data.err_no) return {error: true, isDraw: false};
        return {error: false, isDraw: data.data.free_count === 0}
    }

    // 签到
    async checkIn() {
        let {error, isCheck} = await this.getTodayCheckStatus();
        if (error || isCheck) return;
        let {data} = await axios({url: API.BASE + API.CHECK_IN, method: 'post', headers: {Cookie: this.cookie}});
        if (data.err_no) return await sendMsg('今日掘金签到：失败', JSON.stringify(data), this);
        await sendMsg('今日掘金签到：成功', JSON.stringify(data), this);
    }

    // 查询今日是否已经签到
    async getTodayCheckStatus() {
        let {data} = await axios({url: API.BASE + API.GET_TODAY_STATUS, method: 'get', headers: {Cookie: this.cookie}});
        if (data.err_no) await sendMsg('今日掘金签到查询：失败', JSON.stringify(data), this);
        return {error: data.err_no !== 0, isCheck: data.data}
    }

    // 开始
    async execute() {
        console.log(`----掘金----START----`)
        await this.checkIn();
        await this.draw();
        await this.zyz();
        await this.bugfix();
        console.log(`----掘金----END----`)
    }
}

// 初始化
const init = (config) => {
    if (!config.cookie) return;
    let signUp = new JueJin(config);
    signUp.open();
    return signUp;
}

export default {
    init
}