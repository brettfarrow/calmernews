const Comment = ({ comment }) => {
  const HN_HOSTNAME = 'https://news.ycombinator.com';
  const splitText = comment.body.split('\n');
  return (
    <div style={{ marginLeft: `${comment.level * 24}px` }} className="pb-4">
      <div className="text-gray-700 dark:text-gray-300 pb-2">
        <a
          className="text-indigo-600 dark:text-indigo-200 underline"
          href={`${HN_HOSTNAME}/user?id=${comment.username}`}
        >
          {comment.username}
        </a>{' '}
        (
        <a
          className="text-indigo-600 dark:text-indigo-200 underline"
          href={`${HN_HOSTNAME}/item?id=${comment.id}`}
        >
          {comment.age}
        </a>
        )
      </div>
      <div className="text-gray-800 dark:text-gray-200 pb-3 leading-relaxed">
        {splitText.map((line, index) => (
          <span
            key={index}
            className={
              splitText.length !== index + 1 ? 'comment block mb-4' : 'comment'
            }
            dangerouslySetInnerHTML={{ __html: line }}
          />
        ))}
      </div>
    </div>
  );
};

export default Comment;
