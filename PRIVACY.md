# Privacy Policy for SubStyle

**Last Updated:** November 22, 2024

## Introduction

SubStyle is committed to protecting your privacy. This privacy policy explains how our Chrome extension handles your data.

## Data Collection

**SubStyle does NOT collect, store, or transmit any personal data.**

The extension operates entirely within your browser and does not communicate with external servers for its core subtitle styling functionality.

## Data Storage

SubStyle stores the following data **locally on your device only**:

- **Subtitle Style Preferences** - Your chosen fonts, colors, sizes, and animation preferences
- **Processing State** - Temporary flags to manage subtitle loading (automatically cleared)

All data is stored using Chrome's local storage API and never leaves your device.

## Permissions Explained

SubStyle requests the following permissions:

### activeTab
- **Why:** To detect when you're watching a YouTube video and to interact with the video player
- **What it does:** Allows the extension to read the current page URL and inject styled subtitles
- **Data collected:** None

### storage
- **Why:** To save your preferred subtitle styles
- **What it does:** Stores your customization preferences locally on your device
- **Data collected:** Style settings only (fonts, colors, sizes)

### notifications
- **Why:** To notify you when subtitles are ready to display
- **What it does:** Shows browser notifications
- **Data collected:** None

### scripting
- **Why:** To inject styled subtitles into YouTube pages
- **What it does:** Modifies the YouTube page to display custom subtitles
- **Data collected:** None

## Third-Party Services

SubStyle does **NOT** use:
- Analytics services
- Tracking services
- Advertising networks
- External APIs (for core functionality)

## YouTube Data

When you use SubStyle to load YouTube transcripts:
- The extension accesses YouTube's native transcript data directly from the page
- This data is processed entirely in your browser
- No transcript data is sent to external servers
- No transcript data is stored permanently

## Your Control

You have full control over your data:

- **View Data:** All settings are stored in Chrome's local storage and can be viewed using Chrome DevTools
- **Delete Data:** Uninstalling the extension removes all stored preferences
- **Clear Data:** You can clear individual preferences by resetting to default styles

## Children's Privacy

SubStyle does not knowingly collect any information from children under 13. The extension is designed for general audiences.

## Changes to This Policy

We may update this privacy policy from time to time. The "Last Updated" date at the top will be revised accordingly. Continued use of SubStyle after changes constitutes acceptance of the updated policy.

## Open Source

SubStyle is open source software. You can review the complete source code at:
https://github.com/MattJeff/mySubtitle

## Contact

If you have questions or concerns about this privacy policy, please:
- Open an issue on GitHub: https://github.com/MattJeff/mySubtitle/issues
- Review the source code to verify our privacy practices

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- GDPR (no personal data collected)
- CCPA (no personal data sold or shared)

---

**Your privacy matters to us. SubStyle is built with privacy-first principles.**
