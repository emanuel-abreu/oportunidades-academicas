const cron = require("node-cron");
const { exec } = require("child_process");
require("dotenv").config();

cron.schedule("0 2 * * *", () => {
  exec(`npm run backup`, (err) => {
    if (err) console.error("Backup failed", err);
  });
});
