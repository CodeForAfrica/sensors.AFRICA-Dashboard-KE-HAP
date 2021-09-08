import React from 'react';
import Hero from 'components/Landing/Hero';
import { providers, useSession } from 'next-auth/client';
/* import Router from 'next/router'; */
import { loadNodes } from 'lib/aq';

function Home(props) {
  const [session] = useSession();
  if (session) {
    // Router.push('/dashboard/index.html');
  }
  return (
    <>
      <Hero {...props} />
    </>
  );
}

export async function getStaticProps(context) {
  const nodes = await loadNodes();
  return {
    props: {
      providers: await providers(context),
      nodes: nodes?.length ?? null,
    },
    revalidate: 60 * 60, // 60 minutes
  };
}

export default Home;
