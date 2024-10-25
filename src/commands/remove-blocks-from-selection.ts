import { window } from 'vscode';
import { BlockStore } from '../store';
import { getSelectionRange } from '../helpers';

export const removeBlocksFromSelection = (store: BlockStore) => () => {
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

  console.log('Dropping', blocks.length, 'blocks');

  for (const block of blocks) {
    block.decoration.dispose();
  }

  console.log('Dropped', blocks.length, 'blocks');

  store.deleteBlocksAtRange(editor.document.fileName, start, end);
};
