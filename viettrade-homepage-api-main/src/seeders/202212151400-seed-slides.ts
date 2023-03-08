import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    qi.bulkDelete('slides', {}, {});
    const listCompany: any[] = [];
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
    await qi.bulkInsert('slides', listCompany, {});
  }
};
