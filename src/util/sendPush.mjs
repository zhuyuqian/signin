import axios from 'axios';

export const sendPush = async (title, content, platform) => {
    if (!platform.pushTo) return;
    await axios({
        method: 'post',
        url: `http://www.pushplus.plus/send`,
        data: {
            token: platform.pushTo,
            title: title,
            content: content,
        }
    }).catch(err => {
        return {data: err}
    })
}