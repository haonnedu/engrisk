"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
let LessonsService = class LessonsService {
    constructor() {
        this.store = new Map();
    }
    list() {
        return Array.from(this.store.values());
    }
    create(classId, title) {
        const id = Math.random().toString(36).slice(2, 8);
        const lessonCode = this.generateCode();
        const item = { id, classId, title, lessonCode };
        this.store.set(id, item);
        return item;
    }
    byId(id) {
        const item = this.store.get(id);
        if (!item)
            throw new common_1.NotFoundException('Lesson not found');
        return item;
    }
    generateCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++)
            code += chars[Math.floor(Math.random() * chars.length)];
        return code;
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)()
], LessonsService);
//# sourceMappingURL=lessons.service.js.map