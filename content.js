// Unicode bold character mapping
const boldCharMap = {
  // Uppercase letters
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
  'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
  'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
  'Y': '𝗬', 'Z': '𝗭',

  // Lowercase letters
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
  'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
  'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
  'y': '𝘆', 'z': '𝘇',

  // Numbers
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳',
  '8': '𝟴', '9': '𝟵'
};

/**
 * Convert text to bold Unicode characters
 * @param {string} text - The text to convert
 * @returns {string} - The bold text
 */
function toBold(text) {
  return text
    .split('')
    .map(char => boldCharMap[char] || char)
    .join('');
}

/**
 * Replace selected text in a textarea or input with bold text
 * @param {HTMLElement} element - The textarea or input element
 */
function makeBold(element) {
  const start = element.selectionStart;
  const end = element.selectionEnd;

  // Do nothing if no text is selected
  if (start === end) {
    return;
  }

  const selectedText = element.value.substring(start, end);
  const boldText = toBold(selectedText);

  // Replace the selected text with bold text
  const before = element.value.substring(0, start);
  const after = element.value.substring(end);
  element.value = before + boldText + after;

  // Restore cursor position after the bold text
  const newPosition = start + boldText.length;
  element.setSelectionRange(newPosition, newPosition);

  // Trigger input event so LinkedIn updates its internal state
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Process the bold formatting action
 */
function processBoldFormat() {
  const activeElement = document.activeElement;

  // Check if the active element is a textarea or contenteditable
  const isTextarea = activeElement.tagName === 'TEXTAREA';
  const isInput = activeElement.tagName === 'INPUT' && activeElement.type === 'text';
  const isContentEditable = activeElement.isContentEditable;

  if (isTextarea || isInput) {
    makeBold(activeElement);
  } else if (isContentEditable) {
    // Handle contenteditable elements (some LinkedIn components use these)
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      const boldText = toBold(selectedText);

      range.deleteContents();
      range.insertNode(document.createTextNode(boldText));

      // Collapse selection to end
      selection.collapseToEnd();
    }
  }
}

/**
 * Handle keyboard shortcuts (fallback for when Chrome commands don't fire)
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeydown(event) {
  // Check for Cmd+B (Mac) or Ctrl+B (Windows/Linux)
  const isBoldShortcut = (event.metaKey || event.ctrlKey) && event.key === 'b';

  if (!isBoldShortcut) {
    return;
  }

  event.preventDefault();
  processBoldFormat();
}

// Listen for the Chrome command (customizable shortcut)
if (chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'make-bold') {
      processBoldFormat();
      sendResponse({ success: true });
    }
  });
}

// Add event listener for keyboard shortcuts as fallback
document.addEventListener('keydown', handleKeydown, true);

console.log('LinkedIn Bold Formatter extension loaded');
