import LoadingButton from './LoadingButton';

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
    previous &&
    (!more || (more && pathname !== '/' && asPath !== '/news?p=1' && p === 1));

  // One column for More on the homepage
  // One column for Back when only one page of results
  // Otherwise, two columns for all pages
  const gridCols =
    p === 1 && !showBackButton ? 1 : p === 1 && !more && showBackButton ? 1 : 2;

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
            disabled={loading.button === false ? false : true}
          >
            <span
              className={`w-28 h-12 block leading-12`}
              onClick={() => (window.location.href = previous)}
            >
              {loading.loading && loading.button === 'previous' ? (
                <LoadingButton
                  customClasses={`animate-spin w-8 h-8 mx-10 my-2 text-white`}
                />
              ) : loading.button === 'more' ? (
                ''
              ) : (
                'Previous'
              )}
            </span>
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
            <span
              className={`w-28 h-12 block leading-12`}
              onClick={() => (window.location.href = more)}
            >
              {loading.loading && loading.button === 'more' ? (
                <LoadingButton
                  customClasses={`animate-spin w-8 h-8 mx-10 my-2 text-white`}
                />
              ) : loading.button === 'previous' ? (
                ''
              ) : (
                'More'
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
