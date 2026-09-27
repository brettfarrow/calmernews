import React, { useEffect, useState } from 'react';
import LoadingButton from './LoadingButton';
import Link from 'next/link';
import { useRouter } from 'next/router';

type NavButtonsProps = {
  more?: string | false;
  previous?: string;
  p?: number;
};

const buttonClasses =
  'rounded text-center bg-purple-700 w-28 h-12 m-6 text-white font-bold transition duration-500 ease-in-out hover:bg-purple-800 leading-[3rem]';

export default function NavButtons({ more, previous, p = 1 }: NavButtonsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isDomainFeed = router.pathname === '/from';
  const showPrevious = !isDomainFeed && p > 1 && Boolean(previous);
  const showBack =
    !showPrevious && (router.pathname === '/item' || isDomainFeed || !more);
  const count = Number(showPrevious) + Number(showBack) + Number(Boolean(more));

  useEffect(() => {
    const start = () => setLoading(true);
    const stop = () => setLoading(false);
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', stop);
    router.events.on('routeChangeError', stop);
    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', stop);
      router.events.off('routeChangeError', stop);
    };
  }, [router.events]);

  return (
    <nav
      aria-label="Pagination"
      aria-busy={loading}
      className={`grid ${count > 1 ? 'grid-cols-2' : 'grid-cols-1'} max-w-4xl mx-auto`}
    >
      {showPrevious && (
        <div className="flex justify-center">
          <Link className={buttonClasses} href={previous!} prefetch={false}>
            previous
          </Link>
        </div>
      )}
      {showBack && (
        <div className="flex justify-center">
          <button
            type="button"
            className={buttonClasses}
            onClick={() => router.back()}
          >
            back
          </button>
        </div>
      )}
      {more && (
        <div className="flex justify-center">
          <Link className={buttonClasses} href={more} prefetch={false}>
            more
          </Link>
        </div>
      )}
      {loading && (
        <span role="status" className="flex justify-center col-span-full">
          <LoadingButton customClasses="animate-spin w-6 h-6" />
          <span className="sr-only">Loading page</span>
        </span>
      )}
    </nav>
  );
}
