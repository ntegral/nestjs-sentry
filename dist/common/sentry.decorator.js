"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const sentry_constants_1 = require("./sentry.constants");
function InjectSentry() {
    return common_1.Inject(sentry_constants_1.SENTRY_TOKEN);
}
exports.InjectSentry = InjectSentry;
//# sourceMappingURL=sentry.decorator.js.map