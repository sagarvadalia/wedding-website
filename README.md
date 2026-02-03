# Sagar & Grace Wedding Website

A beautiful passport-themed wedding website for an Indian destination wedding in Cancun, Mexico.

## Features

- **Passport Theme**: Interactive passport cover with flip animation
- **Visa Stamps**: Unique stamp designs for each wedding event
- **Ocean & Sand Color Palette**: Caribbean-inspired blues and sandy neutrals
- **Responsive Design**: Works beautifully on desktop and mobile
- **RSVP System**: Guest lookup by invite code with multi-event selection
- **Admin Dashboard**: Manage guests, track RSVPs, export data

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend**: Express, TypeScript, MongoDB, Mongoose
- **UI Components**: Custom shadcn-inspired components

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd wedding-website
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your MongoDB connection string and other settings.

### Development

Run both client and server in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Frontend (runs on http://localhost:5173)
npm run dev:client

# Backend (runs on http://localhost:5000)
npm run dev:server
```

### Building for Production

```bash
npm run build
```

## Project Structure

```
wedding-website/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Reusable UI components
│   │   │   ├── passport/     # Passport-themed components
│   │   │   └── layout/       # Navigation, Footer
│   │   ├── pages/            # Page components
│   │   ├── lib/              # Utilities and API client
│   │   └── types/            # TypeScript types
│   └── index.html
│
├── server/                    # Express backend
│   └── src/
│       ├── controllers/      # Request handlers
│       ├── models/           # MongoDB models
│       ├── routes/           # API routes
│       └── middleware/       # Auth middleware
│
└── package.json              # Workspace configuration
```

## Pages

| Page         | Description                                              |
| ------------ | -------------------------------------------------------- |
| Home         | Passport cover with flip animation, event stamps preview |
| Our Story    | Timeline of the couple's journey                         |
| Events       | Detailed event schedule with visa stamps                 |
| Travel       | Resort info, flights, packing tips                       |
| Things to Do | Activities at resort and nearby                          |
| RSVP         | Guest lookup and RSVP form                               |
| FAQ          | Common questions and answers                             |
| Admin        | Guest management dashboard                               |

## Wedding Events

- **Welcome Party** - Thursday, April 2, 2027
- **Mehndi Ceremony** - Saturday, April 5, 2027
- **Baraat Procession** - Sunday, April 6, 2027
- **Wedding Ceremony** - Sunday, April 6, 2027
- **Reception Dinner** - Sunday, April 6, 2027
- **After Party** - Sunday, April 6, 2027

## Admin Access

Access the admin dashboard at `/admin`. Default password: `wedding2027`

> **Note**: For production, implement proper authentication with JWT tokens.

## Customization

### Colors

Edit the color palette in `client/src/index.css` under the `@theme` section:

```css
@theme {
  --color-ocean-deep: #1e3a5f;
  --color-ocean-caribbean: #2e8b8b;
  --color-gold: #d4af37;
  /* ... more colors */
}
```

### Wedding Details

Update the wedding information in:

- `client/src/pages/EventsPage.tsx` - Event details
- `client/src/pages/TravelPage.tsx` - Travel info
- `client/src/components/layout/Footer.tsx` - Names and hashtag

## License

Private - All rights reserved

---

Made with ❤️ for Sagar & Grace's wedding celebration
