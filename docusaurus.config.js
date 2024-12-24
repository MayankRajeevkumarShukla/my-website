// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Blog',
  tagline: 'Sharing Knowledge and Stories',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-blog-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config
  organizationName: 'your-org', // Replace with your GitHub org/user name
  projectName: 'your-blog-repo', // Replace with your repo name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false, // Disable docs as this is a blog-focused site
        blog: {
          routeBasePath: '/', // Serve the blog at the site's root
          showReadingTime: true,
          blogSidebarCount: 'ALL', // Show all posts in the sidebar
          blogSidebarTitle: 'All Blog Posts',
          editUrl: 'https://github.com/your-org/your-blog-repo/tree/main/',
          feedOptions: {
            type: ['rss', 'atom'],
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg', // Replace with your site's social sharing image
    navbar: {
      title: 'My Blog',
      logo: {
        alt: 'Blog Logo',
        src: 'img/logo.svg', // Replace with your blog's logo
      },
      items: [
        { to: '/', label: 'Home', position: 'left' },
        { to: '/tags', label: 'Tags', position: 'left' },
        {
          href: 'https://github.com/your-org/your-blog-repo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Explore',
          items: [
            {
              label: 'Home',
              to: '/',
            },
            {
              label: 'Tags',
              to: '/tags',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/your-org/your-blog-repo',
            },
            {
              label: 'Discord',
              href: 'https://discord.com/invite/Np6BjSaXud',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Blog. Built for DcodeBlock.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
