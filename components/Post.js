export default function Post({ post, index }) {
  return (
    <li key={`item-${index}`} className={`text-gray-800 dark:text-gray-100`}>
      <a href={post.href} className={`text-indigo-500 underline`}>
        {post.text}
      </a>
      &nbsp;
      <span>({post.host})</span>
    </li>
  );
}
