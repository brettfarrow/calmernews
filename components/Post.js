export default function Post({ post, index }) {
  return (
    <li key={`item-${index}`}>
      <a href={post.href}>{post.text}</a>
      &nbsp;
      <span>({post.host})</span>
    </li>
  );
}
