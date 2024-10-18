import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

const host ='localhost';
const port = 3000;

web.listen( port, () => {
    logger.info("App start");
    console.log(`Server berjalan pada http://${host}:${port}`);
});