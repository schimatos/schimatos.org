import * as CodeMirror from 'codemirror';
// You are required to install the show-hint addon
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';

// Each adapter can have its own CSS
import 'lsp-editor-adapter/lib/codemirror-lsp.css';
import { LspWsConnection, CodeMirrorAdapter } from 'lsp-editor-adapter';

let editor = CodeMirror(document.querySelector('.editor'), {
  value: 'hello world',

  // Optional: You can add a gutter for syntax error markers
  gutters: ['CodeMirror-lsp']
});

// Take a look at how the example is configured for ideas
let connectionOptions = {
  // Required: Web socket server for the given language server
  serverUri: 'ws://localhost:8080/html',
  // The following options are how the language server is configured, and are required
  rootUri: 'turtle-language-server',
  documentUri: 'file:///path/to/a/directory/file.html',
  documentText: () => editor.getValue(),
  languageId: 'html',
};

// The WebSocket is passed in to allow testability
let lspConnection = new LspWsConnection(editor)
  .connect(new WebSocket('ws://localhost:8080'));

// The adapter is what allows the editor to provide UI elements
let adapter = new CodeMirrorAdapter(lspConnection, {
  // UI-related options go here, allowing you to control the automatic features of the LSP, i.e.
  suggestOnTriggerCharacters: false
}, editor);

// You can also provide your own hooks:
lspConnection.on('error', (e) => {
  console.error(e)
});

// You might need to provide your own hooks to handle navigating to another file, for example:
lspConnection.on('goTo', (locations) => {
  // Do something to handle the URI in this object
});

// To clean up the adapter and connection:
adapter.remove();
lspConnection.close();