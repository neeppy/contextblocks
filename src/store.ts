import { Range, TextEditorDecorationType } from 'vscode';

export type Block = {
  range: Range;
  color: string;
  decoration: TextEditorDecorationType;
};

export type BlockStore = ReturnType<typeof createBlockStore>;

export function createBlockStore() {
  const blocks: Record<string, Block[]> = {};

  return {
    addBlock(fileName: string, block: Block) {
      blocks[fileName] ??= [];
      blocks[fileName].push(block);

      console.log('Added', block.range.start.line, block.range.end.line);
    },
    findAllFromFileName(fileName: string) {
      return blocks[fileName] ?? [];
    },
    findBlocksIntersecting(fileName: string, fromLine: number, toLine: number) {
      const blocksInFile = blocks[fileName] ?? [];

      return blocksInFile.filter((block) => {
        const { start, end } = block.range;

        return Math.max(start.line, fromLine) <= Math.min(end.line, toLine);
      });
    },
    deleteBlocksAtRange(fileName: string, fromLine: number, toLine: number) {
      if (!blocks[fileName]) {
        return;
      }

      blocks[fileName] = blocks[fileName].filter((block) => {
        const { start, end } = block.range;

        return Math.max(start.line, fromLine) > Math.min(end.line, toLine);
      });
    },
  } as const;
}
