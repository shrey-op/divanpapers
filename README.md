# DivanPapers

A modern, scalable, and user-friendly paper-sharing platform designed for students and educators. The platform allows users to upload, search, and download academic papers with ease.

## Features

- User authentication with Google Sign-In
- Paper upload with metadata (Standard, Class, Subject, Medium, Year, School Name)
- Advanced search system with multiple filters
- Dark mode support
- Responsive design for all devices
- Real-time upload progress
- Trending papers section
- Recently uploaded papers section

## Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)

2. Enable the following Firebase services:
   - Authentication (Google Sign-In)
   - Cloud Storage (for paper storage)

3. Get your Firebase configuration and update `firebase.js`:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "your-app.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-app.appspot.com",
       messagingSenderId: "your-sender-id",
       appId: "your-app-id"
   };
   ```

4. Deploy the app:
   - Host it on GitHub Pages
   - Set up the domain in Firebase Authentication settings

## Directory Structure

```
DivanPapers/
│-- index.html           # Main homepage
│-- search.html          # Search page with filters
│-- upload.html          # Upload page for contributors
│-- assets/
│   │-- css/
│   │   ├── styles.css    # Main styles
│   │   ├── dark-mode.css # Dark mode styles
│   │-- js/
│   │   ├── app.js        # Main JavaScript logic
│   │   ├── search.js     # Search functionality
│   │   ├── upload.js     # File upload management
│-- firebase.js         # Firebase configuration
│-- README.md           # Documentation
```

## Development

1. Clone the repository
2. Update Firebase configuration in `firebase.js`
3. Serve the files using a local web server
4. Make changes and test locally
5. Deploy to production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For support, please open an issue in the GitHub repository.
