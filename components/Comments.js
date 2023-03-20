import Comment from './Comment';
import NavButtons from './NavButtons';

const Comments = ({ data }) => {
  const HN_HOSTNAME = 'https://news.ycombinator.com';
  const { id, title, score, byline, age, commentCount, comments, link } = data;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2>
        <a
          href={link}
          className="text-indigo-700 dark:text-indigo-300 underline"
        >
          {title}
        </a>
      </h2>
      <div className="subline pb-6 text-sm text-gray-800 dark:text-gray-200">
        <span className="score">{score} points</span>
        <span className="byline">
          posted by{' '}
          <a className="underline" href={`${HN_HOSTNAME}/user?id=${byline}`}>
            {byline}
          </a>{' '}
          {age}
        </span>
        <div className="sm:inline">
          <span>{commentCount} comments</span>
          <span>
            <a className="underline" href={`${HN_HOSTNAME}/item?id=${id}`}>
              view on hn
            </a>
          </span>
        </div>
      </div>
      <div>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      <NavButtons />
    </div>
  );
};

export default Comments;
