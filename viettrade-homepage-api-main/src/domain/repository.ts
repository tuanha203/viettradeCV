import AdminRepository from './repo/admin';
import AuthRepository from './repo/auth';
import CategoryRepository from './repo/category';
import CategoryDocumentRepository from './repo/categoryDocument';
import CompanyRepository from './repo/company';
import DepartmentRepository from './repo/department';
import DigitalRepository from './repo/digital';
import DocumentRepository from './repo/document';
import GalleryRepository from './repo/gallery';
import MenuRepository from './repo/menu';
import PostRepository from './repo/post';
import ProjectRepository from './repo/project';
import PublicationRepository from './repo/publication';
import QuestionRepository from './repo/question';
import RefreshTokenRepository from './repo/refreshToken';
import SlideRepository from './repo/slide';
import StructureRepository from './repo/structure';
import UserRepository from './repo/user';

// tslint:disable max-classes-per-file
export class Auth extends AuthRepository {}

export class User extends UserRepository {}

export class Admin extends AdminRepository {}

export class Category extends CategoryRepository {}

export class CategoryDocument extends CategoryDocumentRepository {}

export class Post extends PostRepository {}

export class Project extends ProjectRepository {}

export class Company extends CompanyRepository {}

export class Department extends DepartmentRepository {}

export class Document extends DocumentRepository {}

export class Slide extends SlideRepository {}

export class Question extends QuestionRepository {}

export class Gallery extends GalleryRepository {}

export class Publication extends PublicationRepository {}

export class Structure extends StructureRepository {}

export class Menu extends MenuRepository {}

export class Digital extends DigitalRepository {}

export class RefreshToken extends RefreshTokenRepository {}
