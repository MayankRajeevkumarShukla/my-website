// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "My Blog",
  tagline: "Sharing Knowledge and Stories",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "http://localhost", // Changed to localhost for development
  baseUrl: "/",

  // GitHub pages deployment config
  organizationName: "your-org",
  projectName: "your-blog-repo",

  // Changed to 'warn' to help with development
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          routeBasePath: "/",
          showReadingTime: true,
          blogSidebarCount: "ALL",
          blogSidebarTitle: "All Blog Posts",
          // Update this to your actual GitHub repo or remove if not needed
          editUrl: "https://github.com/your-org/your-blog-repo/tree/main/",
        },
        theme: {
          customCss: ["./src/css/custom.css"],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/social-card.jpg",
      navbar: {
        title: "My Blog",
        logo: {
          alt: "Blog Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            to: "/",
            label: "Home",
            position: "left",
          },
          {
            to: "/tags",
            label: "Tags",
            position: "left",
          },
          {
            to: "/user",
            label: "User",
            position: "left",
          },
          {
            href: "https://github.com/your-org/your-blog-repo",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Explore",
            items: [
              {
                label: "Home",
                to: "/",
              },
              {
                label: "Tags",
                to: "/tags",
              },
              {
                label: "User",
                to: "/user",
              },
              {
                to: "/admin",
                label: "Admin",
                position: "right",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/your-org/your-blog-repo",
              },
              {
                label: "Discord",
                href: "https://discord.com/invite/Np6BjSaXud",
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
    }),
};

export default config;
