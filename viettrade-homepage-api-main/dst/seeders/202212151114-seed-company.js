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
        qi.bulkDelete('companies', {}, {});
        const listCompany = [];
        const images = [];
        for (let i = 1; i <= 16; i++) {
            images.push(`public/home/dn-${i}.png`);
        }
        const imagesLK = [];
        for (let i = 1; i <= 6; i++) {
            imagesLK.push(`public/home/lienket-${i}.png`);
        }
        for (let i = 1; i <= 200; i++) {
            listCompany.push({
                name_vi: `Doanh nghiệp ${i}`,
                description_vi: `Mô tả Doanh nghiệp ${i}`,
                name_en: `Company ${i}`,
                description_en: `Description Company ${i}`,
                feature_image: images[Math.floor(Math.random() * images.length)],
                link: 'https://congthuong.vn/',
                display: i,
                connective: 0,
                phone: '0361111222',
                address: 'TP Hà Nội',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        for (let i = 1; i <= 18; i++) {
            listCompany.push({
                name_vi: `Doanh nghiệp ${i}`,
                description_vi: `Mô tả Doanh nghiệp ${i}`,
                name_en: `Company ${i}`,
                description_en: `Description Company ${i}`,
                feature_image: imagesLK[Math.floor(Math.random() * imagesLK.length)],
                link: 'https://vietrade.gov.vn/lien-ket/13/tai-ca-na-da',
                display: i + 200,
                connective: 1,
                phone: '0361111222',
                address: 'TP Hà Nội',
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        yield qi.bulkInsert('companies', listCompany, {});
    })
};
//# sourceMappingURL=202212151114-seed-company.js.map