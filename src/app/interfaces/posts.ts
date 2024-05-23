import { TagDTO } from './tag';

export interface NavPost {
  title: string;
  slug: string;
}

export interface PostEntity {
  id: number;
  image: string;
  title: string;
  content: string;
  description: string;
  slug: string;
  commentaries_open: boolean;
  tags: TagDTO[] | null;
  prev: NavPost | null;
  next: NavPost | null;
  updated_at: Date;
}

export const PostEntity_DefaultInst: PostEntity = {
  commentaries_open: false,
  content: '',
  id: 0,
  image: '',
  next: null,
  prev: null,
  description: '',
  slug: '',
  tags: null,
  title: '',
  updated_at: Date.now() as unknown as Date
};

export enum Sort {
  newest = 'newest',
  oldest = 'oldest'
}

export type SortType = 'newest' | 'oldest';

export interface PostQueryParam {
  title?: string;
  text?: string;
  slug?: string;
  page: number;
  keyword?: string;
  tags?: string;
  sort_by?: Sort;
  date?: number;
}

export interface NodeEl {
  id: string;
  localName: string;
  textContent: string;
  offsetHeight: number;
  offsetLeft: number;
  offsetTop: number;
  offsetWidth: number;
}

export interface TocElement {
  name: string;
  id: string;
  lvl: number;
}
