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
        qi.bulkDelete('galleries', {}, {});
        const listCompany = [];
        const post = [
            {
                title_vi: `Tập đoàn Austdoor`,
                content_vi: `<p><iframe allow="autoplay;" allowfullscreen="" frameborder="0" height="500" src="https://www.youtube.com/embed/Mh5MNcpPAqs?autoplay=1" width="700"></iframe></p>`,
                title_en: `Austdoor Group`,
                content_en: `<p><iframe allow="autoplay;" allowfullscreen="" frameborder="0" height="500" src="https://www.youtube.com/embed/Mh5MNcpPAqs?autoplay=1" width="700"></iframe></p>`,
                feature_video: 'https://www.youtube.com/embed/Mh5MNcpPAqs'
            },
            {
                title_vi: `Công ty Cổ phần Gỗ An Cường`,
                content_vi: `<p><iframe allow="autoplay;" allowfullscreen="" frameborder="0" height="560" src="https://www.youtube.com/embed/pcQuCoNxT_g?autoplay=1" width="700"></iframe></p>`,
                title_en: `An Cuong Wood Joint Stock Company`,
                content_en: `<p><iframe allow="autoplay;" allowfullscreen="" frameborder="0" height="560" src="https://www.youtube.com/embed/pcQuCoNxT_g?autoplay=1" width="700"></iframe></p>`,
                feature_video: 'https://www.youtube.com/embed/pcQuCoNxT_g'
            },
            {
                title_vi: `AGRIBANK - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam`,
                content_vi: `<p><iframe allow="autoplay;" allowfullscreen="" frameborder="0" height="560" src="https://www.youtube.com/embed/KxgSQE0Ajlc?autoplay=1" width="700"></iframe></p>`,
                title_en: `AGRIBANK - Bank for Agriculture and Rural Development of Vietnam`,
                content_en: `<p><iframe allow="autoplay;" allowfullscreen="" frameborder="0" height="560" src="https://www.youtube.com/embed/KxgSQE0Ajlc?autoplay=1" width="700"></iframe></p>`,
                feature_video: 'https://www.youtube.com/embed/KxgSQE0Ajlc'
            },
            {
                title_vi: `Ông Vũ Bá Phú, Cục trưởng Cục Xúc tiến thương mại trả lời phỏng vấn Truyền hình Nhân dân`,
                content_vi: `<p>Ông Vũ Bá Phú, Cục trưởng Cục Xúc tiến thương mại trả lời phỏng vấn Truyền hình Nhân dân về Tháng khuyến mại tập trung Quốc gia - Vietnam Grand Sale 2020. Chi tiết nội dung Tháng khuyến mại tập trung Quốc gia tại link đi kèm<a dir="auto" href="https://www.youtube.com/redirect?v=jGO8QgjHzv0&amp;redir_token=QUFFLUhqbk5STjhtQktVdFdmZTRfZHE0SkdHTnA1aldiUXxBQ3Jtc0trNFJ1dWtMb1g1akVCeTFiakhCeGVCNDRsZU41TVJNNGY0RlU5Tm1ZOWNQYTJPM0ZLSnVtLThXYU5qQmg5ZVdaYWpRbGV1MjN3WEhkWlR1bS1QOWplZ2dZU1pQUmZYMm00WFpqNFV4NkpPeHVHRTExVQ%3D%3D&amp;event=video_description&amp;q=https%3A%2F%2Fbit.ly%2Fkmtt2020" rel="nofollow" spellcheck="false" target="_blank">https://bit.ly/kmtt2020</a></p><p style="text-align:center"><iframe allow=";" allowfullscreen="" frameborder="0" height="360" src="https://www.youtube.com/embed/jGO8QgjHzv0" width="640"></iframe></p>`,
                title_en: `Mr. Vu Ba Phu, Director of the Trade Promotion Department gave an interview to People's Television`,
                content_en: `<p><font style="vertical-align:inherit"><font style="vertical-align:inherit">Mr. Vu Ba Phu, Director of the Department of Trade Promotion gave an interview to People's Television about the National Focused Promotion Month - Vietnam Grand Sale 2020. Details of the content of the National Focused Promotion Month can be found at the attached link</font></font><a dir="auto" href="https://www.youtube.com/redirect?v=jGO8QgjHzv0&amp;redir_token=QUFFLUhqbk5STjhtQktVdFdmZTRfZHE0SkdHTnA1aldiUXxBQ3Jtc0trNFJ1dWtMb1g1akVCeTFiakhCeGVCNDRsZU41TVJNNGY0RlU5Tm1ZOWNQYTJPM0ZLSnVtLThXYU5qQmg5ZVdaYWpRbGV1MjN3WEhkWlR1bS1QOWplZ2dZU1pQUmZYMm00WFpqNFV4NkpPeHVHRTExVQ%3D%3D&amp;event=video_description&amp;q=https%3A%2F%2Fbit.ly%2Fkmtt2020" rel="nofollow" spellcheck="false" target="_blank"><font style="vertical-align:inherit"><font style="vertical-align:inherit">https ://bit.ly/kmtt2020</font></font></a></p><p style="text-align:center"><iframe allow=";" allowfullscreen="" frameborder="0" height="360" src="https://www.youtube.com/embed/jGO8QgjHzv0" width="640"></iframe></p>`,
                feature_video: 'https://www.youtube.com/embed/jGO8QgjHzv0'
            },
            {
                title_vi: `Mời đăng ký tham gia xét chọn sản phẩm đạt Thương hiệu quốc gia Việt Nam năm 2020`,
                content_vi: `<iframe width="560" height="315" src="https://www.youtube.com/embed/-OdsbZzbKCs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                title_en: `Please register to participate in the selection of products to win the Vietnam National Brand in 2020`,
                content_en: `<iframe width="560" height="315" src="https://www.youtube.com/embed/-OdsbZzbKCs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                feature_video: 'https://www.youtube.com/embed/-OdsbZzbKCs'
            },
            {
                title_vi: `Đi giữa thương chiến Mỹ - Trung, ngành gỗ cần làm gì để giữ vững đà tăng trưởng?`,
                content_vi: `<iframe width="560" height="315" src="https://www.youtube.com/embed/N20TjvXZ8Us" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                title_en: `Going between the US-China trade war, what does the wood industry need to do to maintain its growth momentum?`,
                content_en: `<iframe width="560" height="315" src="https://www.youtube.com/embed/N20TjvXZ8Us" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                feature_video: 'https://www.youtube.com/embed/N20TjvXZ8Us'
            },
            {
                title_vi: `Bảo vệ thương hiệu cho doanh nghiệp Việt`,
                content_vi: `<iframe width="560" height="315" src="https://www.youtube.com/embed/7doI79uJSYY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                title_en: `Brand protection for Vietnamese businesses`,
                content_en: `<iframe width="560" height="315" src="https://www.youtube.com/embed/7doI79uJSYY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                feature_video: 'https://www.youtube.com/embed/7doI79uJSYY'
            },
            {
                title_vi: `Góc nhìn chuyên gia: Bảo vệ thương hiệu cho doanh nghiệp Việt`,
                content_vi: `<iframe width="560" height="315" src="https://www.youtube.com/embed/f8Mbsk-x59c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                title_en: `Expert perspective: Brand protection for Vietnamese businesses`,
                content_en: `<iframe width="560" height="315" src="https://www.youtube.com/embed/f8Mbsk-x59c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                feature_video: 'https://www.youtube.com/embed/f8Mbsk-x59c'
            },
            {
                title_vi: `Mang chuông đi đánh xứ người`,
                content_vi: `<iframe width="560" height="315" src="https://www.youtube.com/embed/OiP_vGOP6GE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                title_en: `Bring the bell to fight the country`,
                content_en: `<iframe width="560" height="315" src="https://www.youtube.com/embed/OiP_vGOP6GE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                feature_video: 'https://www.youtube.com/embed/OiP_vGOP6GE'
            },
            {
                title_vi: `Thương hiệu quốc gia - Cần chiến lược mới`,
                content_vi: `<iframe width="560" height="315" src="https://www.youtube.com/embed/obo__HikTz8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                title_en: `National brand - Need a new strategy`,
                content_en: `<iframe width="560" height="315" src="https://www.youtube.com/embed/obo__HikTz8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
                feature_video: 'https://www.youtube.com/embed/obo__HikTz8'
            }
        ];
        for (let i = 9; i >= 0; i--) {
            listCompany.push(Object.assign(Object.assign({}, post[i]), { createdAt: new Date(), updatedAt: new Date() }));
        }
        yield qi.bulkInsert('galleries', listCompany, {});
    })
};
//# sourceMappingURL=202212151400-seed-galleries.js.map