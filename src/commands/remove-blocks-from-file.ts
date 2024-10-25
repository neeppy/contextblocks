import { window } from 'vscode';
import { BlockStore } from '../store';

export const removeBlocksFromFile = (store: BlockStore) => () => {
  const editor = window.activeTextEditor;

  if (!editor) {
    return;
  }

  const blocks = store.findAllFromFileName(editor.document.fileName);

  for (const block of blocks) {
    block.decoration.dispose();
  }

  store.deleteBlocksAtRange(
    editor.document.fileName,
    0,
    editor.document.lineCount,
  );
};
