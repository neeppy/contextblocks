import { window } from 'vscode';
import { BlockStore } from '../store';
import { getSelectionRange } from '../helpers';

export const removeFromSelection = (store: BlockStore) => () => {
  const editor = window.activeTextEditor;

  if (!editor) {
    return;
  }

  const { start, end } = getSelectionRange(editor);

  const blocks = store.findBlocksIntersecting(
    editor.document.fileName,
    start,
    end,
  );

  for (const block of blocks) {
    block.decoration.dispose();
  }

  store.deleteBlocksAtRange(editor.document.fileName, start, end);
};
