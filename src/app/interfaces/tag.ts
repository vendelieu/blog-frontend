export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface UpdatableTag extends Tag {
  value: string | undefined;
}

export interface NewTag {
  name: string;
  slug: string;
}
