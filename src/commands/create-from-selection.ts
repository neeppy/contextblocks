import { window } from 'vscode';
import { BlockStore } from '../store';
import { getSelectionRange } from '../helpers';
import { createBlock } from '../use-cases';

export const createFromSelection = (store: BlockStore) => () => {
  const editor = window.activeTextEditor;

  if (!editor) {
    return;
  }

  let { start, end } = getSelectionRange(editor);

  createBlock(store, editor, start, end);
};
