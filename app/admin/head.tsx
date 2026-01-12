export default function Head(){
  const title = "Admin Console – Customers, Consultations & Billing | Dial A Vet";
  const description = "Administer the Dial A Vet platform: customers, vets, consultations, subscriptions, partner codes, and exports.";
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

