import React from 'react';
import Hero from 'components/Landing/Hero';
import { providers, useSession } from 'next-auth/client';
import Router from 'next/router';

function Home(props) {
  const [session] = useSession();
  if (session) {
    Router.push('/dashboard/index.html');
  }
  return (
    <>
      <Hero {...props} />
    </>
  );
}

export async function getStaticProps(context) {
  return { props: { providers: await providers(context) } };
}

export default Home;
