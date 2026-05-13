const boldCharMap = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
  'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
  'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
  'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
  'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
  'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
  'y': '𝘆', 'z': '𝘇',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳',
  '8': '𝟴', '9': '𝟵'
};

function toBold(text) {
  return text.split('').map(char => boldCharMap[char] || char).join('');
}

function makeBold(element) {
  const start = element.selectionStart;
  const end = element.selectionEnd;
  if (start === end) return;

  const boldText = toBold(element.value.substring(start, end));
  element.value = element.value.substring(0, start) + boldText + element.value.substring(end);
  element.setSelectionRange(start + boldText.length, start + boldText.length);
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

function processBoldFormat() {
  const activeElement = document.activeElement;

  if (activeElement.tagName === 'TEXTAREA' || (activeElement.tagName === 'INPUT' && activeElement.type === 'text')) {
    makeBold(activeElement);
    return;
  }

  const selection = window.getSelection();
  const selectedText = selection.toString();
  if (!selectedText) return;

  const boldText = toBold(selectedText);

  // execCommand operates on the browser's actual selection, bypassing LinkedIn's isCollapsed patch
  if (document.execCommand('insertText', false, boldText)) return;

  // Fallback: paste simulation directly on the Quill editor
  const editor = document.querySelector('.ql-editor[contenteditable="true"]');
  if (!editor) return;

  if (selection.rangeCount > 0) selection.getRangeAt(0).deleteContents();
  const dt = new DataTransfer();
  dt.setData('text/plain', boldText);
  editor.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt }));

  // Final fallback: manual DOM insertion
  if (selection.rangeCount > 0 && selection.toString().length > 0) {
    const r = selection.getRangeAt(0);
    r.deleteContents();
    const textNode = document.createTextNode(boldText);
    r.insertNode(textNode);
    r.setStartAfter(textNode);
    r.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(r);
    editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: boldText }));
  }
}

function handleKeydown(event) {
  const isBoldShortcut = (event.metaKey || event.ctrlKey) && event.key === 'b';
  if (!isBoldShortcut) return;
  event.preventDefault();
  processBoldFormat();
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'make-bold') processBoldFormat();
});

document.addEventListener('keydown', handleKeydown, true);

console.log('LinkedIn Bold Formatter v1.1.7 loaded');
