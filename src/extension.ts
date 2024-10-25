import vscode from 'vscode';
import { createBlockStore } from './store';
import {
  createBlockFromSelection,
  removeBlocksFromSelection,
  removeBlocksFromFile,
} from './commands';

export function activate(context: vscode.ExtensionContext) {
  const blockStore = createBlockStore();

  // TODO feature: make blocks visible on the vscode map
  // TODO feature: toggle block create/delete for keybindings
  // TODO feature: toggle block visibility
  // TODO feature: inline color picker for blocks???
  // TODO feature: color rotation
  // TODO feature: highlight from current line
  // TODO feature: highlight from current code block
  // TODO fix: handle event when editor is closed
  const createFromSelectionCommand = vscode.commands.registerCommand(
    'colorblocks.create-block-from-selection',
    createBlockFromSelection(blockStore),
  );

  const removeFromSelectionCommand = vscode.commands.registerCommand(
    'colorblocks.remove-blocks-from-selection',
    removeBlocksFromSelection(blockStore),
  );

  const removeFromFileCommand = vscode.commands.registerCommand(
    'colorblocks.remove-blocks-from-file',
    removeBlocksFromFile(blockStore),
  );

  context.subscriptions.push(
    createFromSelectionCommand,
    removeFromSelectionCommand,
    removeFromFileCommand,
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
