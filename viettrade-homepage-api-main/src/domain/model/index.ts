import { values } from 'lodash';
import * as Sequelize from 'sequelize';

import admin, { Admin } from './admin';
import category, { Category } from './category';
import categoryDocument, { CategoryDocument } from './categoryDocument';
import company, { Company } from './company';
import department, { Department } from './department';
import digital, { Digital } from './digital';
import document, { Document } from './document';
import gallery, { Gallery } from './gallery';
import menu, { Menu } from './menu';
import post, { Post } from './post';
import project, { Project } from './project';
import publication, { Publication } from './publication';
import question, { Question } from './question';
import refreshToken, { RefreshToken } from './refreshToken';
import slide, { Slide } from './slide';
import structure, { Structure } from './structure';
import user, { User } from './user';

export type DB = ReturnType<typeof initialize>;

export const initialize = (sqlize: Sequelize.Sequelize) => {
  const db = {
    User: sqlize.import(User.name, user),
    Admin: sqlize.import(Admin.name, admin),
    CategoryDocument: sqlize.import(CategoryDocument.name, categoryDocument),
    Category: sqlize.import(Category.name, category),
    Post: sqlize.import(Post.name, post),
    Project: sqlize.import(Project.name, project),
    Company: sqlize.import(Company.name, company),
    Department: sqlize.import(Department.name, department),
    Document: sqlize.import(Document.name, document),
    Slide: sqlize.import(Slide.name, slide),
    Question: sqlize.import(Question.name, question),
    Gallery: sqlize.import(Gallery.name, gallery),
    Publication: sqlize.import(Publication.name, publication),
    Structure: sqlize.import(Structure.name, structure),
    Menu: sqlize.import(Menu.name, menu),
    Digital: sqlize.import(Digital.name, digital),
    RefreshToken: sqlize.import(RefreshToken.name, refreshToken)
  };

  // initialize all association of all model
  for (const model of values(db)) {
    if (typeof model.ASSOCIATE === 'function') {
      model.ASSOCIATE();
    }
  }

  return {
    ...db,
    sequelize: sqlize,
    Sequelize
  };
};
