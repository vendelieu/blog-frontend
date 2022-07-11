export interface CommentDTO {
  post_slug: string;
  text: string;
  reply_to: number | null;
}

export interface Comment {
  id: number;
  post_slug: string;
  username: string;
  text: number;
  reply_to: number | null;
  updated_at: Date;
  created_at: Date;
}
