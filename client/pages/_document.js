import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  //   static async getInitialProps(ctx) {
  //     const initialProps = await Document.getInitialProps(ctx);
  //     return { ...initialProps };
  //   }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <link
            rel='shortcut icon'
            type='image/x-icon'
            href='https://res.cloudinary.com/firebeat/image/upload/v1607469951/favicon_smb2cr.png'
          />
        </Head>
        <title>Ticket Master</title>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
