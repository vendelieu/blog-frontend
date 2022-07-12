import { Tag } from './tag';

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
  tags: Tag[] | null;
  prev: NavPost | null;
  next: NavPost | null;
  updated_at: Date;
}

export enum Sort {
  newest = 'newest', oldest = 'oldest'
}

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
