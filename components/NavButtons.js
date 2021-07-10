import LoadingButton from './LoadingButton';
import Link from 'next/link';
import { Prefetch } from '@layer0/react';

export default function NavButtons({ loading, setLoading, more, previous, p }) {
  return (
    <div className={`grid ${p > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
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
            <Link href={previous}>
              <Prefetch url={`/api${previous}`}>
                <a className={`w-28 h-12 block leading-12`} href={previous}>
                  {loading.loading && loading.button === 'previous' ? (
                    <LoadingButton />
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
            <Link href={more}>
              <Prefetch url={`/api${more}`}>
                <a className={`w-28 h-12 block leading-12`} href={more}>
                  {loading.loading && loading.button === 'more' ? (
                    <LoadingButton />
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
