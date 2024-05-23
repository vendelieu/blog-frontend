export interface Tag {
  name: string;
  slug: string;
}

export interface TagDTO extends Tag {
  id: number | undefined;
}
