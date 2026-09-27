import Link from 'next/link';

type LoadErrorProps = { message: string };

export default function LoadError({ message }: LoadErrorProps) {
  return (
    <div className="max-w-4xl mx-auto p-4" role="alert">
      <p>{message}</p>
      <Link className="underline" href="/">
        Return to the front page
      </Link>
    </div>
  );
}
