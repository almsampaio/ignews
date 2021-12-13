import { GetStaticProps } from 'next';
import Head from 'next/head';

import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

// 3 ways to make an api request with Next.js:
// Client-side => heavy requests, requests that can be displayed after render the page
// Server-side => user specific and real time requests, information that needs to be in the page already (indexed in google)
// Static site generation 
//   => general requests for pages that every user will visit and that doesn't change frequently (indexed in google)

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => { // static request
  // export const getServerSideProps: GetServerSideProps = async () => { // server-side request
  const price = await stripe.prices.retrieve('price_1JqkZZHJrVakW0Wp2yl6L5pE')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100) 
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 hours (static way only)
  }
}