# Support Ticket Dashboard

A responsive support-ticket dashboard built with Next.js, React, TypeScript, and Redux.

## Features

* View support tickets
* Search and filter tickets
* View ticket details
* Manage ticket status and priority
* Responsive dashboard interface
* Client-side state management with Redux
* AI-assisted ticket information where available
* Error and loading states
* Automated tests for important application behaviour

## Requirements

Before running the project, make sure you have:

* Node.js 18 or newer
* npm
* Git

## Installation

Clone the repository and enter the project directory:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd support-ticket-dashboard
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the project root if the application requires environment variables.

Example:

```env
NEXT_PUBLIC_API_URL=
AI_API_KEY=
```

Only add variables that are actually required by the application.

### Important

Do not commit secrets, API keys, passwords, or other private credentials to GitHub.

The `.env.local` file should be included in `.gitignore`.

## Running the Development Server

Start the application with:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production Build

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

## Running Tests

Run the test suite using:

```bash
npm test
```

If the project uses a different test command, use the command defined in `package.json`.

For a watch mode, if supported:

```bash
npm test -- --watch
```

## Project Structure

```text
support-ticket-dashboard/
├── app/                    # Next.js application routes
├── src/
│   ├── components/        # Reusable UI components
│   ├── store/              # Redux store and state
│   └── ...
├── public/                 # Static assets
├── DECISIONS.md            # Technical decisions and trade-offs
├── README.md               # Project documentation
├── package.json            # Dependencies and scripts
└── ...
```

## Testing Approach

Tests focus on important application behaviour rather than implementation details.

The tests are designed to be deterministic and should not depend on random delays or random errors from the fake API.

Important areas include:

1. Ticket data/state behaviour
2. Ticket filtering/search behaviour
3. Ticket status or priority updates

## Known Limitations

The development version may use a fake or simulated API. Its random delays and errors are not used as the basis for automated test results.

Production deployment would require a persistent backend, authentication, proper API error handling, and a production-grade real-time update mechanism.

## Technical Decisions

See `DECISIONS.md` for:

* Ambiguous requirements and decisions
* Test-ticket handling
* Data ownership
* Live-update decisions
* AI trust model
* Deferred work
* Development mistakes and lessons learned
