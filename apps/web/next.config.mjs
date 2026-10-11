/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';

const nextConfig = {
  output: isGithubPages ? 'export' : undefined,
  trailingSlash: true,
  basePath: isGithubPages && repoName ? `/${repoName}` : '',
  assetPrefix: isGithubPages && repoName ? `/${repoName}/` : undefined,
  transpilePackages: ['@hotel/store', '@hotel/config', '@hotel/types'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  }
};

export default nextConfig;
