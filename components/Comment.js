function splitStringIgnoringPre(input, delimiter) {
  const preTagRegex = /<pre[\s\S]*?<\/pre>/gi;
  const preTags = [];
  let match;

  // Store all matches of the <pre></pre> tag, and replace them with placeholders in the input string
  while ((match = preTagRegex.exec(input)) !== null) {
    preTags.push(match[0]);
  }

  preTags.forEach((preTag, index) => {
    input = input.split(preTag).join(`{{PRE_TAG_${index}}}`);
  });

  // Split the string using the delimiter
  const parts = input.split(delimiter);

  // Replace the placeholders with the original <pre></pre> tags
  return parts.map((part) =>
    part.replace(/{{PRE_TAG_(\d+)}}/g, (_, index) => preTags[index])
  );
}

const Comment = ({ comment }) => {
  const HN_HOSTNAME = 'https://news.ycombinator.com';
  const splitText = splitStringIgnoringPre(comment.body, '\n');
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
          href={`/item?id=${comment.id}`}
        >
          {comment.age}
        </a>
        )
      </div>
      <div className="text-gray-800 dark:text-gray-200 pb-3 leading-relaxed lg:text-lg">
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
