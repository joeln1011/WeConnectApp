# WeConnectApp

A social networking app for connecting with people, joining groups, sharing posts, and communicating via real-time chat and video calls.

## Features
- User profiles and friend system (send, accept, cancel, unfriend)
- Groups: explore, join/leave, pending requests, roles, members
- Posts: personal and group posts, comments, likes
- Real-time notifications and messaging (Socket.io)
- Video calls (WebRTC)
- Responsive UI (Material UI + Tailwind-like utility classes)

## Tech Stack
- React + Vite
- Redux Toolkit + RTK Query
- Socket.io client
- WebRTC
- React Router
- Material UI (MUI)
- react-hook-form + Yup
- Deployed on Vercel

## Requirements
- Node.js 18+ and npm/yarn/pnpm
- Running backend API (WeConnect API)

## Getting Started
1) Clone and install
```bash
git clone <your-repo-url>
cd WeConnectApp
npm install
# or: pnpm install / yarn
```

2) Environment variables
Create a .env (or .env.local) in the project root:
```bash
VITE_BASE_URL=https://api.holetex.com/v1/we-connect
# Optional:
# VITE_SOCKET_URL=wss://api.holetex.com
# VITE_TURN_URL=...
# VITE_TURN_USERNAME=...
# VITE_TURN_CREDENTIAL=...
```

3) Run
```bash
npm run dev       # start dev server
npm run build     # build for production
npm run preview   # preview production build
```

## Project Structure (high level)
- src/components: UI components (Users, Groups, Posts, etc.)
- src/pages: Route pages (Home, Group, User Profile)
- src/services: RTK Query APIs (rootApi, groupApi, friendApi, groupPostApi)
- src/context: Providers (Socket, VideoCall)
- src/hooks: Custom hooks (auth, layout, infinite scroll)
- src/libs: Constants and helpers

## API Notes
- Base URL is read from VITE_BASE_URL.
- Auth: Bearer token is attached automatically; refresh token flow handled in rootApi.
- Common endpoints used:
  - /login, /signup, /verify-otp, /refresh-token
  - /groups, /groups/:id, /groups/:id/join, /groups/:id/leave
  - /groups/:id/posts, /groups/posts/:postId/likes
  - /user/groups
  - /friends, friend requests, etc.

## Troubleshooting
- Duplicate keys warning
  - Cause: duplicate items from API.
  - Fix: de-duplicate by _id in transformResponse or with a Set before render.

- [object Object] in group URLs (e.g., /groups/[object Object]/posts)
  - Cause: passing an object instead of string id.
  - Fix: pass primitive id using Outlet context or extract id in services; guard with { skip: !groupId }.

- PARSING_ERROR on DELETE (204/404)
  - Cause: empty body or wrong path.
  - Fix: set responseHandler: "text" for DELETE and verify endpoint paths.

- 404/undefined id (e.g., /groups/undefined)
  - Fix: use useParams() or useOutletContext() properly and skip queries until id exists.

## Contributing
- Open an issue or PR with a clear description.
- Keep slices/APIs typed and co-located; prefer RTK Query tags and optimistic updates.

## License
Add your license (e.g., MIT) here.
