import { ICommonAttr, ICommonSearchOption } from './_common';

export interface IQuestionMainAttr {
  question_vi: string;
  answer_vi: string;
  question_en: string;
  answern_en: string;
  display: number;
}

export interface IQuestionAttr extends IQuestionMainAttr, ICommonAttr {}

export interface IQuestionCreateParams {
  question_vi: string;
  answer_vi: string;
  question_en: string;
  answern_en: string;
  display: number;
}
export interface IQuestionUpdateParams {
  question_vi: string;
  answer_vi: string;
  question_en: string;
  answern_en: string;
  display: number;
}

export interface IQuestionSearchParams extends ICommonSearchOption {
  question_vi?: string;
  answer_vi?: string;
  question_en?: string;
  answern_en?: string;
  display?: number;
  sort?: string;
  search?: string;
}
