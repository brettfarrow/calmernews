import PullToRefresh from './PullToRefresh';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import LoadingButton from './LoadingButton';
import { useEffect } from 'react';

declare global {
  interface Window {
    posthog: PostHog;
  }
}

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { asPath } = router;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => window.history.forward(),
    onSwipedRight: () => router.back(),
    preventScrollOnSwipe: true,
  });

  const handleRefresh = async (): Promise<void> => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    router.reload();
  };

  const refreshingContent = (
    <LoadingButton customClasses={`animate-spin w-8 h-8 my-8 mx-auto`} />
  );

  useEffect(() => {
    window?.posthog?.capture('$pageview');
  }, [asPath]);

  return (
    <>
      <PullToRefresh
        pullingContent={''}
        onRefresh={handleRefresh}
        refreshingContent={refreshingContent}
      >
        <div className="bg-white dark:bg-gray-800" {...swipeHandlers}>
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
};

export default Page;
