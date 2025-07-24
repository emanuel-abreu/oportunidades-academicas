const { execSync } = require("child_process");
require("dotenv").config();
const path = require("path");
const timestamp = new Date().toISOString().slice(0, 10);
const file = path.join(process.env.BACKUP_PATH, `backup-${timestamp}.sql`);
execSync(
  `pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -F c -b -v -f ${file} ${process.env.DB_NAME}`
);
