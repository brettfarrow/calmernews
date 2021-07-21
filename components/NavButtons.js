import LoadingButton from './LoadingButton';
import Link from 'next/link';
import { Prefetch } from '@layer0/react';

export default function NavButtons({
  loading,
  setLoading,
  more,
  previous,
  p,
  router,
}) {
  // Show the back button except on page 1 of home
  const { pathname, asPath } = router;
  const showBackButton =
    !more || (more && pathname !== '/' && asPath !== '/news?p=1' && p === 1);

  // One column for More on the homepage
  // One column for Back when only one page of results
  // Otherwise, two columns for all pages
  const gridCols =
    p === 1 && !showBackButton ? 1 : p === 1 && !more && showBackButton ? 1 : 2;

  return (
    <div className={`grid grid-cols-${gridCols}`}>
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
            disabled={loading.button === false ? false : true}
          >
            <Link href={previous} passHref>
              <Prefetch url={`/api${previous}`}>
                <a className={`w-28 h-12 block leading-12`} href={previous}>
                  {loading.loading && loading.button === 'previous' ? (
                    <LoadingButton
                      customClasses={`animate-spin w-8 h-8 mx-10 my-2 text-white`}
                    />
                  ) : loading.button === 'more' ? (
                    ''
                  ) : (
                    'Previous'
                  )}
                </a>
              </Prefetch>
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
            disabled={loading.button === false ? false : true}
          >
            {loading.loading && loading.button === 'back' ? (
              <LoadingButton
                customClasses={`animate-spin w-8 h-8 mx-10 my-2 text-white`}
              />
            ) : loading.button === 'previous' ? (
              ''
            ) : (
              'Back'
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
            disabled={loading.button === false ? false : true}
          >
            <Link href={more} passHref>
              <Prefetch url={`/api${more}`}>
                <a className={`w-28 h-12 block leading-12`} href={more}>
                  {loading.loading && loading.button === 'more' ? (
                    <LoadingButton
                      customClasses={`animate-spin w-8 h-8 mx-10 my-2 text-white`}
                    />
                  ) : loading.button === 'previous' ? (
                    ''
                  ) : (
                    'More'
                  )}
                </a>
              </Prefetch>
            </Link>
          </button>
        </div>
      )}
    </div>
  );
}
