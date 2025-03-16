// app/page.tsx
'use client'; // Ensure this is a client component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /login on page load
    router.push('/login');
  }, [router]);

  return null; // Or a loading state here
};

export default Home;
