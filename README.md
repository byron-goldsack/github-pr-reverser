# GitHub PR Conversation Reverser

A Browser extension that reverses the order of GitHub pull request conversations so the most recent comments appear at the top.
Build primarily for Microsoft Edge, but should work with any chromium based browser that supports Manifest V3

## Features

- **Automatic Detection**: Works on any GitHub PR or issue page
- **One-Click Toggle**: Easily switch between newest-first and oldest-first order
- **Visual Indicator**: Shows when conversation order is reversed
- **Smooth Transitions**: Animated reordering for better user experience
- **Dark Mode Support**: Adapts to GitHub's theme preferences

## Installation

1. Download or clone this repository
2. Open Edge and go to `edge://extensions/`
3. Turn on "Developer mode"
4. Click "Load unpacked extension"
5. Browse to the extension folder and select it

## How to Use

1. Navigate to any GitHub pull request or issue page
2. The extension will automatically reverse the conversation order
3. Look for the blue indicator at the top of the conversation showing "Conversation order reversed - newest first"
4. Click the toggle button (↕️) in the indicator to switch between orders
5. Alternatively, click the extension icon in the toolbar and use the popup to toggle

## Troubleshooting

### Extension Not Working?
1. Make sure you're on a GitHub PR or issue page
2. Try refreshing the page
3. Check that the extension is enabled in `edge://extensions/`
4. Look for any error messages in the browser console (F12 → Console)

### Comments Not Reversing?
1. Wait a moment for the page to fully load
2. Try clicking the toggle button in the blue indicator
3. Use the extension popup to manually toggle
4. Some very old GitHub layouts might not be supported

### Performance Issues?
The extension is lightweight and shouldn't affect page performance. If you experience issues:
1. Try disabling and re-enabling the extension
2. Clear browser cache
3. Check for conflicting extensions

## Development

To modify or enhance the extension:

1. Edit the relevant files (`content.js`, `styles.css`, etc.)
2. Go to `edge://extensions/`
3. Click the reload button on the extension
4. Test your changes on a GitHub PR page

## Contributing

Feel free to submit issues or pull requests if you find bugs or have suggestions for improvements!

## License

This project is open source and available under the MIT License.


