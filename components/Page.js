import PullToRefresh from 'react-simple-pull-to-refresh';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import LoadingButton from './LoadingButton';
import { useEffect } from 'react';

export default function Page({ children }) {
  const router = useRouter();
  const { asPath } = router;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => window.history.forward(),
    onSwipedRight: () => router.back(),
    preventScrollOnSwipe: true,
  });

  const handleRefresh = () => {
    setTimeout(() => router.reload(), 0);
  };

  const refreshingContent = (
    <LoadingButton customClasses={`animate-spin w-8 h-8 my-8 mx-auto`} />
  );

  useEffect(() => {
    posthog.capture('$pageview');
  }, [asPath]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PullToRefresh
        pullingContent={''}
        onRefresh={handleRefresh}
        refreshingContent={refreshingContent}
      >
        <div
          className="bg-coolGray-100 dark:bg-coolGray-700"
          {...swipeHandlers}
        >
          <h1
            className={`text-3xl text-gray-800 dark:text-gray-200 flex justify-center p-4`}
          >
            <Link href="/" passHref>
              calmer news
            </Link>
          </h1>
          {children}
        </div>
      </PullToRefresh>
    </>
  );
}
