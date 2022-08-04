import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import "social-toolkit/lib/index.css";
import { Layout, Post, PostContainer, PostProps } from "social-toolkit";
import { useState } from "react";

const Home: NextPage = () => {
  const [post, setPosts] = useState<PostProps[]>([
    {
      user: "0xjjpa",
      username: "Jose Aguinaga",
      content: "Whatever content comes here.",
      publishTime: new Date(),
    },
  ]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Poster</title>
        <meta
          name="description"
          content="A decentralized web application for interacting with ERC-3722 – Poster"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className={styles.main}>
          <ConnectButton />

          <h1 className={styles.title}>Poster</h1>

          <p className={styles.description}>
            A decentralized web application for interacting with ERC-3722
          </p>

          <div className={styles.grid}>
            <div className="section-container">
              <PostContainer type="row">
                {post.map((row, index) => (
                  <Post {...row} key={index} />
                ))}
              </PostContainer>
            </div>
          </div>
        </main>
      </Layout>
      <footer className={styles.footer}>
        <a href="https://rainbow.me" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by your frens at 🌈
        </a>
      </footer>
    </div>
  );
};

export default Home;
