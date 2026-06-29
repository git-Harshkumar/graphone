/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.worldvectorlogo.com', 'assets-global.website-files.com', 'mistral.ai', 'midjourney.com', 'elevenlabs.io', 'runwayml.com', 'huggingface.co', 'databricks.com', 'x.ai', 'cohere.com', 'adept.ai', 'character.ai', 'stability.ai', 'scale.com', 'wandb.ai', 'langchain.com', 'pinecone.io', 'synthesia.io', 'replit.com', 'glean.com', 'sierra.ai', 'together.ai', 'lambdalabs.com', 'coreweave.com', 'cerebras.net', 'groq.com', 'poolside.ai', 'magic.ai', 'codeium.com', 'sourcegraph.com', 'tabnine.com', 'mosaicml.com', 'modular.com', 'imbue.com', 'contextual.ai', 'twelvelabs.io', 'pika.art', 'heygen.com', 'descript.com', 'notion.so', 'figma.com', 'linear.app', 'vercel.com', 'supabase.com', 'prisma.io', 'temporal.io', 'robustintelligence.com', 'arthur.ai', 'snorkel.ai'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;