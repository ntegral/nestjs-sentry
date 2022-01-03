"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeInjectableDecorator = void 0;
const common_1 = require("@nestjs/common");
const makeInjectableDecorator = (token) => () => (0, common_1.Inject)(token);
exports.makeInjectableDecorator = makeInjectableDecorator;
//# sourceMappingURL=injectDecoratoryFactory.js.map