import Page from '../../components/Page';
import News from '../../components/News';
import { useRouter } from 'next/router';

function Subreddit({ data, cookies }) {
  const router = useRouter();
  const { subreddit } = router.query;

  const handleChange = (event) => {
    if (event.keyCode === 13) {
      // 13 is the keyCode for the return key (Enter)
      changeSubreddit(event.target.value);
    }
    if (event.type === 'click') {
      changeSubreddit(event.target.previousSibling.value);
    }
  };

  const changeSubreddit = (subreddit) => {
    router.push(`/r/${subreddit}`);
  };

  return (
    <Page>
      <div className="flex flex-col md:flex-row p-4 justify-center gap-4">
        <input
          type="text"
          placeholder={subreddit}
          onKeyDown={handleChange}
          className="p-2 rounded text-black border-2 border-slate-300 dark:border-0 outline-purple-400 w-full md:w-1/2 lg:w-1/4"
        />
        <input
          type="submit"
          onSubmit={handleChange}
          onClick={handleChange}
          value="change subreddit"
          className={`p-2 rounded text-center bg-purple-700 hover:bg-purple-800 text-white font-bold transition duration-500 ease-in-out`}
          aria-describedby="input-description"
        />
        <span id="input-description" className="sr-only">
          Press Enter to change the subreddit after entering your text.
        </span>
      </div>
      <News data={data} cookies={cookies} />
    </Page>
  );
}

Subreddit.getInitialProps = async (ctx) => {
  if (ctx.req) {
    const { url } = ctx.req;
    let data;
    try {
      data = await fetch(`${process.env.HOST}/api${url}`).then((r) => r.text());
    } catch (e) {
      console.error('error', e);
      return {
        status: 500,
        error: e,
      };
    }
    console.log('data', data);
    let jsonData;
    try {
      jsonData = JSON.parse(data);
      console.log('jsonData', jsonData);
    } catch (e) {
      console.error('error', e);
      return {
        status: 500,
        error: e,
      };
    }
    return {
      data: jsonData,
      cookies: ctx.req.cookies,
    };
  } else {
    const data = await fetch(`/api${ctx.asPath}`).then((r) => r.json());
    const cookies = document.cookie.split('; ').reduce((prev, current) => {
      const [name, ...value] = current.split('=');
      prev[name] = value.join('=');
      return prev;
    }, {});
    return {
      data,
      cookies,
    };
  }
};

export default Subreddit;
