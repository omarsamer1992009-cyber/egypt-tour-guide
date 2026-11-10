EGYPT TOUR GUIDE — MIT APP INVENTOR WEBVIEWER KIT

This kit contains the redesigned HTML/CSS/JavaScript interface and only the images referenced by it. Files are intentionally kept flat (no subfolders) because App Inventor Media assets are uploaded individually.

SETUP
1. Create a NEW project in MIT App Inventor (for example EgyptTourGuideNew).
2. In Designer, add a WebViewer component to Screen1. Set Width = Fill parent and Height = Fill parent.
3. Upload index.html, styles.css, app.js, and all six image files in this folder using the Media panel.
4. Set WebViewer.HomeUrl to: file:///android_asset/index.html
5. Set WebViewer.FollowLinks = true.
6. Build the APK and test it on a device.

IMPORTANT
- Upload all files listed here; do not recreate an assets subfolder.
- This is a frontend-only prototype. It does not import or preserve the original APK's App Inventor blocks, databases, screens, or other app logic.
- If the WebViewer shows a blank page, first test by setting HomeUrl to index.html (some App Inventor versions resolve bundled assets differently), then rebuild.
- External Google Fonts require internet; system fallback fonts are included.
