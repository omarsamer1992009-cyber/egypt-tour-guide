CREATE ACCOUNT FIRST UPDATE\n\nThe Create Account screen now opens automatically before the main Egypt Tour Guide page. After valid form submission, the visitor is taken directly to the destinations/monuments section. The demo stores only a session flag and non-sensitive name/email values; it never stores passwords. See README_VSCODE.md for setup instructions and the security limitation.\n

PERSONALIZED ACCOUNT WELCOME
- The create-account form asks “What is your name?”
- After the visitor submits the form, the site displays “Welcome, [entered name]!”
- The welcome message can be dismissed with its close button.
- This remains a front-end demo; it does not create a secure real account.

## Travel companion update (November 2026)
This version adds a map embed and external full-map link, a simple editable itinerary suggestion tool, an admission budget estimator, a three-question history quiz, a short historical timeline, quick map searches for nearby services, browser-persisted favorites, a dark-mode preference, and an Arabic/English toggle for the navigation and travel-tools headings/actions. The app remains a static front-end demo: sign-up is not a real authenticated account system, itinerary suggestions are not bookings, map/service results are provided by Google Maps, and the ticket estimator uses the visitor-entered average price rather than live ticket data. A secure admin dashboard requires a backend, database, and authenticated administrator roles and is intentionally not exposed in this static build.
