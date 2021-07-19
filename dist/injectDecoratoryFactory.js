"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
exports.makeInjectableDecorator = (token) => () => common_1.Inject(token);
//# sourceMappingURL=injectDecoratoryFactory.js.map