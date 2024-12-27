import React from 'react';
import Layout from '@theme/Layout';
import User from '@site/src/components/user/User';

export default function UserPage() {
  return (
    <Layout
      title="Submit Blog"
      description="Submit your blog post">
      <main className="container margin-vert--lg">
        <h1>Submit a Blog Post</h1>
        <User />
      </main>
    </Layout>
  );
}