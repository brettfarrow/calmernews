import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html className={`dark no-js`} lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `document.documentElement.classList.remove("no-js");`,
            }}
          />
        </Head>
        <body className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
