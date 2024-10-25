import { Position, Range, window } from 'vscode';
import { Block, BlockStore } from '../store';
import { getSelectionRange } from '../helpers';

export const createBlockFromSelection = (store: BlockStore) => () => {
  const editor = window.activeTextEditor;

  if (!editor) {
    return;
  }

  let { start, end } = getSelectionRange(editor);

  const intersectingBlocks = store.findBlocksIntersecting(
    editor.document.fileName,
    start,
    end,
  );

  if (intersectingBlocks.length) {
    [start, end] = mergeWithExistingBlocks(start, end, intersectingBlocks);

    for (const block of intersectingBlocks) {
      block.decoration.dispose();
    }

    store.deleteBlocksAtRange(editor.document.fileName, start, end);
  }

  const range = new Range(new Position(start, 0), new Position(end, 0));

  const decoration = window.createTextEditorDecorationType({
    isWholeLine: true,
    backgroundColor: '#2c698c50',
  });

  store.addBlock(editor.document.fileName, {
    range,
    decoration,
    color: '#2c698c50',
  });

  editor.setDecorations(decoration, [range]);
};

function mergeWithExistingBlocks(start: number, end: number, blocks: Block[]) {
  const rangeStarts = blocks.map((block) => block.range.start.line);
  const rangeEnds = blocks.map((block) => block.range.end.line);

  const minStart = Math.min(...rangeStarts, start);
  const maxEnd = Math.max(...rangeEnds, end);

  return [minStart, maxEnd] as const;
}
