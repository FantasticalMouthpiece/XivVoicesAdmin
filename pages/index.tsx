import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

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

          {!loading && !session && (
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

          {session && (
            <>
              <div className={styles.userInfo}>
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className={styles.avatar}
                  />
                )}
                <div>
                  <p>Signed in as {session.user?.name}</p>
                  <p>{session.user?.email}</p>
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