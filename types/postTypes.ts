interface PostItem {
    id: number;
    href: string;
    text: string;
    user: string;
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

interface Comment {
    id: number;
    username: string;
    age: string;
    body: string;
    level: number;
}

type PostsProps = {
    from: boolean;
    items: PostItem[];
    start: number;
    showComments: boolean;
    showByline: boolean;
    showScore: boolean;
    children?: React.ReactNode;
};

export type { PostItem, Comment, PostsProps };
