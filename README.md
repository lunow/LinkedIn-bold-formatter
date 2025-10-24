# LinkedIn Bold Formatter

A Chrome extension that allows you to format selected text as bold in LinkedIn posts, comments, and messages using a keyboard shortcut.

## Features

- **Keyboard Shortcut**: Press `Cmd+B` (Mac) or `Ctrl+B` (Windows/Linux) to make selected text bold
- **Customizable Shortcut**: Change the keyboard shortcut in Chrome's extension settings
- **Unicode Bold**: Converts text to Unicode bold characters (𝗮𝗯𝗰 → 𝗮𝗯𝗰)
- **Works Everywhere**: Functions in all LinkedIn text areas including posts, comments, and messages
- **Non-intrusive**: Does nothing if no text is selected

## Installation

### For Development

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked"
5. Select the `LinkedIn-Formatter` directory

### For Production

Package the extension through the Chrome Web Store developer dashboard.

## Usage

1. Navigate to LinkedIn.com
2. Click into any text area (post composer, comment box, message field, etc.)
3. Type or paste your text
4. Select the text you want to make bold
5. Press `Cmd+B` (Mac) or `Ctrl+B` (Windows/Linux)
6. The selected text will be replaced with bold Unicode characters

## Customizing the Keyboard Shortcut

You can change the default keyboard shortcut if it conflicts with other extensions or your preferences:

1. Open Chrome and navigate to `chrome://extensions/shortcuts`
2. Find "LinkedIn Bold Formatter" in the list
3. Click the pencil icon next to "Make selected text bold"
4. Press your desired key combination
5. Click "OK" to save

Note: Some key combinations may be reserved by Chrome or your operating system.

## How It Works

The extension converts regular characters to their Unicode bold equivalents:
- Regular: `Hello World 123`
- Bold: `𝗛𝗲𝗹𝗹𝗼 𝗪𝗼𝗿𝗹𝗱 𝟭𝟮𝟯`

This works on LinkedIn because these are actual Unicode characters, not formatting markup.

## Technical Details

- **Manifest Version**: 3
- **Permissions**: None (only content script injection)
- **Supported Characters**: A-Z, a-z, 0-9
- **Content Script**: Runs on all LinkedIn pages

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Any Chromium-based browser supporting Manifest V3

## License

MIT License - Feel free to modify and distribute as needed.
