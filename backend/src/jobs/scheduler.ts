import { runSync } from "./sync";
import { env } from '../config/env';


async function start() {
    console.log(`Sync scheduler starting — running every ${env.syncIntervalMinutes} minutes.`);
    await runSync(); // run once immediately on startup

    setInterval(async () => {
        console.log('Scheduled sync starting.....');
        await runSync();
    }, env.syncIntervalMinutes * 60 * 1000);
}



start();