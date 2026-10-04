# Vercel-Ready Node.js PDF Suite

This project is fully structured and optimized to run on **Vercel Serverless Functions**. It uses in-memory file buffers via `multer.memoryStorage()`, completely bypassing the read-only limitations of serverless environments.

## Local Development
1. Extract this ZIP archive.
2. Run `npm install` to grab dependencies.
3. Start your app using a serverless dev environment like `vercel dev` or wrap a local listener around `api/index.js`.

## GitHub & Vercel Deployment
1. Initialize a Git repository inside this folder: `git init`
2. Push your codebase to a new **GitHub repository**.
3. Import the repository into your **Vercel Dashboard**.
4. Vercel will automatically read `vercel.json` and deploy it perfectly without any extra configuration!
