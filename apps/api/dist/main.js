"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cors = require("cors");
const app_config_1 = require("./common/config/app.config");
const validation_config_1 = require("./common/config/validation.config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('CORS Config:', app_config_1.appConfig.cors);
    console.log('CORS_ORIGIN env:', process.env.CORS_ORIGIN);
    app.use(cors(app_config_1.appConfig.cors));
    app.useGlobalPipes(new common_1.ValidationPipe(validation_config_1.validationConfig));
    app.setGlobalPrefix('api');
    await app.listen(app_config_1.appConfig.port);
    console.log(`API running on http://localhost:${app_config_1.appConfig.port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map