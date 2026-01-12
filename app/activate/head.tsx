export default function Head(){
  const title = "Activate Partner Code – Unlock Free Online Vet Access";
  const description = "Redeem your 8‑digit partner code to unlock Dial A Vet access. Verify by phone and complete your profile to begin.";
  const og = "/seo/og.jpg";
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={og} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={og} />
    </>
  );
}

