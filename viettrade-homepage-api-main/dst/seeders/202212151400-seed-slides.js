"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    up: (qi) => __awaiter(void 0, void 0, void 0, function* () {
        qi.bulkDelete('slides', {}, {});
        const listCompany = [];
        const images = [];
        for (let i = 1; i <= 7; i++) {
            images.push(`public/home/slide-${i}.png`);
        }
        for (let i = 1; i <= 14; i++) {
            listCompany.push({
                title: `Trình chiếu ${i}`,
                feature_image: images[Math.floor(Math.random() * images.length)],
                link: 'https://www.google.com/',
                display: i,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        yield qi.bulkInsert('slides', listCompany, {});
    })
};
//# sourceMappingURL=202212151400-seed-slides.js.map