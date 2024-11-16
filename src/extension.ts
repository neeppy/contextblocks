import vscode from 'vscode';
import { createBlockStore } from './store';
import {
  createFromSelection,
  createFromCodeBlock,
  removeFromSelection,
  removeFromFile,
} from './commands';

export function activate(context: vscode.ExtensionContext) {
  const blockStore = createBlockStore();

  // TODO feature: make blocks visible on the vscode map
  // TODO feature: toggle block create/delete for keybindings
  // TODO feature: toggle block visibility
  // TODO feature: inline color picker for blocks???
  // TODO feature: color rotation
  // TODO feature: highlight from current line
  // TODO feature: highlight from current code block     -- DONE
  // TODO fix: handle event when editor is closed
  const createFromSelectionCommand = vscode.commands.registerCommand(
    'colorblocks.create-from-selection',
    createFromSelection(blockStore),
  );

  const createFromCodeBlockCommand = vscode.commands.registerCommand(
    'colorblocks.create-from-code-block',
    createFromCodeBlock(blockStore),
  );

  const removeFromSelectionCommand = vscode.commands.registerCommand(
    'colorblocks.remove-from-selection',
    removeFromSelection(blockStore),
  );

  const removeFromFileCommand = vscode.commands.registerCommand(
    'colorblocks.remove-from-file',
    removeFromFile(blockStore),
  );

  context.subscriptions.push(
    createFromSelectionCommand,
    createFromCodeBlockCommand,
    removeFromSelectionCommand,
    removeFromFileCommand,
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
