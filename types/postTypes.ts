export interface PostItem {
  id: number;
  href: string;
  text: string;
  user: string;
  host: string;
  score: number;
  age: string;
  comments: number;
}

export interface Comment {
  id: string;
  position: number;
  username: string;
  age: string;
  body: string;
  level: number;
}

export interface NewsData {
  page: number;
  start: number;
  items: PostItem[];
  more: string | false;
  previous: string;
  from: boolean;
}

export interface ItemData {
  id: string;
  title: string;
  host: string;
  link: string;
  score: number;
  byline: string;
  age: string;
  postBody: string;
  commentCount: number;
  comments: Comment[];
}

export type PostsProps = {
  from: boolean;
  items: PostItem[];
  start: number;
  showComments: boolean;
  showByline: boolean;
  showScore: boolean;
  children?: React.ReactNode;
};
