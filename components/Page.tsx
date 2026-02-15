import PullToRefresh, { type PullProgress } from './PullToRefresh';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import LoadingButton from './LoadingButton';
import { useEffect } from 'react';

const PullIndicator: React.FC<PullProgress> = ({ progress, isThresholdMet }) => {
  // Arrow rotates from pointing down (0°) to pointing up (180°) as you pull
  const rotation = Math.min(progress, 1) * 180;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <svg
        className="w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-150"
        style={{ transform: `rotate(${rotation}deg)` }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {isThresholdMet ? 'Release to refresh' : 'Pull to refresh'}
      </span>
    </div>
  );
};

declare global {
  interface Window {
    posthog: PostHog;
  }
}

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { asPath } = router;

  const swipeHandlers = useSwipeNavigation({
    onSwipedLeft: () => window.history.forward(),
    onSwipedRight: () => router.back(),
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
        pullingContent={(info) => <PullIndicator {...info} />}
        onRefresh={handleRefresh}
        refreshingContent={refreshingContent}
      >
        <div className="bg-white dark:bg-gray-800" {...swipeHandlers}>
          <header>
            <h1
              className={`text-3xl text-gray-800 dark:text-gray-200 flex justify-center p-4`}
            >
              <Link href="/" passHref>
                calmer news
              </Link>
            </h1>
          </header>
          <main>
            {children}
          </main>
        </div>
      </PullToRefresh>
    </>
  );
};

export default Page;
