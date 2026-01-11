import React, { useEffect, useState } from 'react';
import LoadingButton from './LoadingButton';
import Link from 'next/link';
import { useRouter } from 'next/router';

type NavButtonsProps = {
  more?: string;
  previous?: string;
  p?: number;
};

const NavButtons: React.FC<NavButtonsProps> = ({ more, previous, p }) => {
  // Show the back button except on page 1 of home
  const [loading, setLoading] = useState({
    loading: false,
    button: '',
  });
  const router = useRouter();
  const { pathname, asPath } = router;
  const isCommentPage = pathname.includes('/item');
  const showBackButton =
    isCommentPage ||
    (previous &&
      (!more ||
        (more && pathname !== '/' && asPath !== '/news?p=1' && p === 1)));

  // One column for More on the homepage
  // One column for Back when only one page of results
  // Otherwise, two columns for all pages
  const gridCols =
    isCommentPage ||
    (p === 1 && !showBackButton) ||
    (p === 1 && !more && showBackButton)
      ? 1
      : 2;

  // Attempts to handle loading button state becoming stuck
  const resetLoadingButton = () => {
    if (loading) {
      setTimeout(() => {
        setLoading({
          loading: false,
          button: '',
        });
      }, 1000);
    }
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', resetLoadingButton);
    return () => {
      router.events.off('routeChangeComplete', resetLoadingButton);
    };
  }, []);

  useEffect(() => {
    resetLoadingButton();
  }, [more, previous, p]);

  return (
    <div className={`grid grid-cols-${gridCols} max-w-4xl mx-auto`}>
      {p > 1 && (
        <div className={`flex justify-center`}>
          <button
            className={`rounded text-center bg-purple-700 w-28 h-12 m-6 text-white font-bold transition duration-500 ease-in-out hover:bg-purple-800`}
            onClick={() =>
              setLoading({
                loading: true,
                button: 'previous',
              })
            }
            disabled={loading.button === '' ? false : true}
          >
            <Link href={previous} passHref>
              <span className={`w-28 h-12 block leading-[3rem]`}>
                {loading.loading && loading.button === 'previous' ? (
                  <LoadingButton
                    customClasses={`animate-spin w-8 h-8 mx-10 my-2 text-white`}
                  />
                ) : loading.button === 'more' ? (
                  ''
                ) : (
                  'previous'
                )}
              </span>
            </Link>
          </button>
        </div>
      )}
      {showBackButton && (
        <div className={`flex justify-center`}>
          <button
            className={`rounded text-center bg-purple-700 w-28 h-12 m-6 text-white font-bold transition duration-500 ease-in-out hover:bg-purple-800`}
            onClick={() => {
              setLoading({
                loading: true,
                button: 'back',
              });
              router.back();
            }}
            disabled={loading.button === '' ? false : true}
          >
            {loading.loading && loading.button === 'back' ? (
              <LoadingButton
                customClasses={`animate-spin w-8 h-8 mx-10 my-2 text-white`}
              />
            ) : loading.button === 'previous' ? (
              ''
            ) : (
              'back'
            )}
          </button>
        </div>
      )}
      {more && (
        <div className={`flex justify-center`}>
          <button
            className={`rounded text-center bg-purple-700 w-28 h-12 m-6 text-white font-bold transition duration-500 ease-in-out hover:bg-purple-800`}
            onClick={() =>
              setLoading({
                loading: true,
                button: 'more',
              })
            }
            disabled={loading.button === '' ? false : true}
          >
            <Link href={more} passHref>
              <span className={`w-28 h-12 block leading-[3rem]`}>
                {loading.loading && loading.button === 'more' ? (
                  <LoadingButton
                    customClasses={`animate-spin w-8 h-8 mx-10 my-2 text-white`}
                  />
                ) : loading.button === 'previous' ? (
                  ''
                ) : (
                  'more'
                )}
              </span>
            </Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default NavButtons;
