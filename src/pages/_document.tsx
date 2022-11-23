import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <Head>
          <link rel="icon" href="/logo.svg" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="author" content="Ajay Kanniyappan" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
