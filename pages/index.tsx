import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user;

  return (
    <div className={styles.container}>
      <Head>
        <title>XIV Voices Admin</title>
        <meta name="description" content="Admin panel for XIV Voices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.highlight}>XIV Voices Admin</span>
        </h1>

        <div className={styles.authContainer}>
          {loading && <div>Loading...</div>}

          {!loading && !user && (
            <>
              <p>You are not signed in</p>
              <button
                className={styles.discordButton}
                onClick={() => signIn('discord')}
              >
                Sign in with Discord
              </button>
            </>
          )}

          {user && (
            <>
              <div className={styles.userInfo}>
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name}
                    className={styles.avatar}
                  />
                )}
                <div>
                  <p>Signed in as {user.name}</p>
                  <p>{user.email}</p>
                </div>
              </div>
              <button
                className={styles.signOutButton}
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}