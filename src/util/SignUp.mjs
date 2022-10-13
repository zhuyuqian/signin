import {CronJob} from 'cron';

export class SignUp {
    constructor(config) {
        this.cookie = config.cookie || '';
        this.cron = config.cron || '';
        this.emailTo = config.emailTo || '';
        this.pushTo = config.pushTo || '';
        this.immediately = config.immediately || false;
    }

    execute() {
    }

    open() {
        if (this.immediately) this.execute();
        if (this.cron) {
            let job = new CronJob(this.cron, async () => this.execute())
            job.start();
        }
    }
}