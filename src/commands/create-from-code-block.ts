import { window } from 'vscode';
import { BlockStore } from '../store';
import { createBlock } from '../use-cases';

const CodeBlockStartRegexes = [/.+[^<([]{\s*$/, /.+:$/];
const CodeBlockStartExceptions = [/(const|let)\s*{\s*$/];
const CodeBlockEndRegexes = [/}[,)\]};]*\s*$/];

export const createFromCodeBlock = (store: BlockStore) => () => {
  const editor = window.activeTextEditor;

  if (!editor) {
    return;
  }

  let { line: lookupLine } = editor.selection.active;
  let {
    text: lookupStartText,
    firstNonWhitespaceCharacterIndex: lookupIndent,
  } = editor.document.lineAt(lookupLine);

  let index = lookupLine;

  while (lookupStartText.length === 0 && index >= 0) {
    index--;

    const line = editor.document.lineAt(index);

    lookupStartText = line.text;
    lookupIndent = line.firstNonWhitespaceCharacterIndex;
  }

  let blockStartLine = 0;
  let blockEndLine = 0;

  let shouldExpectClosingBracket = false;

  const isTopLevel = lookupIndent === 0;

  while (index >= 0) {
    const { text, firstNonWhitespaceCharacterIndex: indent } =
      editor.document.lineAt(index);

    if ((indent >= lookupIndent && !isTopLevel) || text.length === 0) {
      index--;
      continue;
    }

    lookupIndent = indent;

    const isMatchingBlockStart =
      CodeBlockStartRegexes.some((regex) => regex.test(text)) ||
      text.trim() === '{';

    const isException = CodeBlockStartExceptions.some((regex) =>
      regex.test(text),
    );

    const isBlockStart = isMatchingBlockStart && !isException;

    if (isBlockStart) {
      blockStartLine = index;
      shouldExpectClosingBracket = !text.trim().endsWith(':');

      break;
    }

    index--;
  }

  index = lookupLine;

  while (index < editor.document.lineCount) {
    const { text, firstNonWhitespaceCharacterIndex: indent } =
      editor.document.lineAt(index);

    const isLowerLevel = indent < lookupIndent;
    const isEmptyLine = text.trim().length === 0;
    const isMatchingBlockEnd = CodeBlockEndRegexes.some((regex) =>
      regex.test(text),
    );

    const isBlockEnd = shouldExpectClosingBracket
      ? isMatchingBlockEnd && isLowerLevel
      : isLowerLevel || isEmptyLine;

    if (isBlockEnd) {
      blockEndLine = index - Number(!shouldExpectClosingBracket);
      break;
    }

    index++;
  }

  createBlock(store, editor, blockStartLine, blockEndLine);
};
