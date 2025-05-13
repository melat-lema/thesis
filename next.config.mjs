/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      remotePatterns: [
        // UploadThing
        {
          protocol: "https",
          hostname: "utfs.io",
          pathname: '/f/**',
        },
        // Mux
        {
          protocol: "https",
          hostname: "image.mux.com",
        },
        {
          protocol: "https",
          hostname: "stream.mux.com",
        },
        // Clerk
        {
          protocol: "https",
          hostname: "img.clerk.com",
        },
        {
          protocol: "https",
          hostname: "*.clerk.com",
        },
        {
          protocol: "https",
          hostname: "img.clerk.dev",
        },
        {
          protocol: "https",
          hostname: "*.clerk.dev",
        },
        // Add other domains you might need...
      ],
    },
   
      async headers() {
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: "frame-ancestors 'self' https://*.clerk.accounts.dev"
              }
            ]
          }
        ];
      }
    };
  
  
  export default nextConfig;