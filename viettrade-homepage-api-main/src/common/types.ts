import * as adminFactory from './factory/admin';
import * as authFactory from './factory/auth';
import * as categoryFactory from './factory/category';
import * as categoryDocumentFactory from './factory/categoryDocument';
import * as companyFactory from './factory/company';
import * as departmentFactory from './factory/department';
import * as digitalFactory from './factory/digital';
import * as documentFactory from './factory/document';
import * as galleryFactory from './factory/gallery';
import * as menuFactory from './factory/menu';
import * as postFactory from './factory/post';
import * as projectFactory from './factory/project';
import * as publicationFactory from './factory/publication';
import * as questionFactory from './factory/question';
import * as refreshTokenFactory from './factory/refreshToken';
import * as slideFactory from './factory/slide';
import * as structureFactory from './factory/structure';
import * as userFactory from './factory/user';

export namespace user {
  export import Attr = userFactory.IUserAttr;
  export import MainAttr = userFactory.IUserMainAttr;
  export import CreateParams = userFactory.IUserCreateParams;
  export import SearchParams = userFactory.IUserSearchParams;
  export import RegisterParams = userFactory.IUserRegisterParams;
  export import UpdateParams = userFactory.IUserUpdateParams;
  export import Role = userFactory.Role;
  export import Status = userFactory.Status;
}

export namespace admin {
  export import Attr = adminFactory.IAdminAttr;
  export import MainAttr = adminFactory.IAdminMainAttr;
  export import CreateParams = adminFactory.IAdminCreateParams;
  export import SearchParams = adminFactory.IAdminSearchParams;
  export import RegisterParams = adminFactory.IAdminRegisterParams;
  export import UpdateParams = adminFactory.IAdminUpdateParams;
  export import Role = adminFactory.Role;
  export import Status = adminFactory.Status;
}

export namespace auth {
  export import LoginParams = authFactory.ILoginParams;
  export import UserInfo = authFactory.IUserInfo;
  export import ContactInfo = authFactory.IContactInfo;
  export import ForgotPasswordParams = authFactory.ForgotPasswordParams;
}

export namespace category {
  export import Attr = categoryFactory.ICategoryAttr;
  export import CreateParams = categoryFactory.ICategoryCreateParams;
  export import UpdateParams = categoryFactory.ICategoryUpdateParams;
  export import SearchParams = categoryFactory.ICategorySearchParams;
  export import UpdateDisplayParams = categoryFactory.ICategoryUpdateDisplayParams;
}

export namespace post {
  export import Attr = postFactory.IPostAttr;
  export import CreateParams = postFactory.IPostCreateParams;
  export import UpdateParams = postFactory.IPostUpdateParams;
  export import SearchParams = postFactory.IPostSearchParams;
  export import Publish = postFactory.Publish;
}

export namespace project {
  export import Attr = projectFactory.IProjectAttr;
  export import CreateParams = projectFactory.IProjectCreateParams;
  export import UpdateParams = projectFactory.IProjectUpdateParams;
  export import SearchParams = projectFactory.IProjectSearchParams;
}

export namespace company {
  export import Attr = companyFactory.ICompanyAttr;
  export import CreateParams = companyFactory.ICompanyCreateParams;
  export import UpdateParams = companyFactory.ICompanyUpdateParams;
  export import SearchParams = companyFactory.ICompanySearchParams;
  export import Connective = companyFactory.Connective;
  export import Status = companyFactory.Status;
}

export namespace slide {
  export import Attr = slideFactory.ISlideAttr;
  export import CreateParams = slideFactory.ISlideCreateParams;
  export import UpdateParams = slideFactory.ISlideUpdateParams;
  export import SearchParams = slideFactory.ISlideSearchParams;
  export import UpdateDisplayParams = slideFactory.ISlideUpdateDisplayParams;
}

export namespace gallery {
  export import Attr = galleryFactory.IGalleryAttr;
  export import CreateParams = galleryFactory.IGalleryCreateParams;
  export import UpdateParams = galleryFactory.IGalleryUpdateParams;
  export import SearchParams = galleryFactory.IGallerySearchParams;
}

export namespace publication {
  export import Attr = publicationFactory.IPublicationAttr;
  export import CreateParams = publicationFactory.IPublicationCreateParams;
  export import UpdateParams = publicationFactory.IPublicationUpdateParams;
  export import SearchParams = publicationFactory.IPublicationSearchParams;
}

export namespace question {
  export import Attr = questionFactory.IQuestionAttr;
  export import CreateParams = questionFactory.IQuestionCreateParams;
  export import UpdateParams = questionFactory.IQuestionUpdateParams;
  export import SearchParams = questionFactory.IQuestionSearchParams;
}

export namespace structure {
  export import Attr = structureFactory.IStructureAttr;
  export import CreateParams = structureFactory.IStructureCreateParams;
  export import UpdateParams = structureFactory.IStructureUpdateParams;
  export import SearchParams = structureFactory.IStructureSearchParams;
  export import UpdateDisplayParams = structureFactory.IStructureUpdateDisplayParams;
}

export namespace department {
  export import Attr = departmentFactory.IDepartmentAttr;
  export import CreateParams = departmentFactory.IDepartmentCreateParams;
  export import UpdateParams = departmentFactory.IDepartmentUpdateParams;
  export import SearchParams = departmentFactory.IDepartmentSearchParams;
}

export namespace categoryDocument {
  export import Attr = categoryDocumentFactory.ICategoryDocumentAttr;
  export import CreateParams = categoryDocumentFactory.ICategoryDocumentCreateParams;
  export import UpdateParams = categoryDocumentFactory.ICategoryDocumentUpdateParams;
  export import SearchParams = categoryDocumentFactory.ICategoryDocumentSearchParams;
}

export namespace document {
  export import Attr = documentFactory.IDocumentAttr;
  export import CreateParams = documentFactory.IDocumentCreateParams;
  export import UpdateParams = documentFactory.IDocumentUpdateParams;
  export import SearchParams = documentFactory.IDocumentSearchParams;
}

export namespace menu {
  export import Attr = menuFactory.IMenuAttr;
  export import CreateParams = menuFactory.IMenuCreateParams;
  export import UpdateParams = menuFactory.IMenuUpdateParams;
  export import SearchParams = menuFactory.IMenuSearchParams;
  export import UpdateDisplayParams = menuFactory.IMenuUpdateDisplayParams;
}

export namespace digital {
  export import Attr = digitalFactory.IDigitalAttr;
  export import CreateParams = digitalFactory.IDigitalCreateParams;
  export import UpdateParams = digitalFactory.IDigitalUpdateParams;
  export import SearchParams = digitalFactory.IDigitalSearchParams;
  export import UpdateDisplayParams = digitalFactory.IDigitalUpdateDisplayParams;
}

export namespace refreshToken {
  export import Attr = refreshTokenFactory.IRefreshTokenMainAttr;
  export import CreateParams = refreshTokenFactory.IRefreshTokenCreateParams;
}
