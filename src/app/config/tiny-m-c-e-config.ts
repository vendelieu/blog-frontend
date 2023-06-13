export const TinyMCEConfig = {
  plugins: ['lists', 'link', 'image', 'media', 'code', 'codesample', 'anchor', 'wordcount'],
  menubar: 'view insert format',
  toolbar: 'h1 h2 h3 | codesample bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | image link media anchor',
  codesample_global_prismjs: true,
  codesample_languages: [
    {text: 'Kotlin', value: 'kotlin'},
    {text: 'HTML/XML', value: 'markup'},
    {text: 'TypeScript', value: 'typescript'},
    {text: 'Rust', value: 'rust'},
    {text: 'Python', value: 'python'},
    {text: 'Java', value: 'java'},
    {text: 'Bash', value: 'bash'},
  ],
  browser_spellcheck: true,
  formats: {
    h1: {block: 'h1', attributes: {'id': '%value'}},
    h2: {block: 'h2', attributes: {'id': '%value'}},
    h3: {block: 'h3', attributes: {'id': '%value'}},
    h4: {block: 'h4', attributes: {'id': '%value'}},
    h5: {block: 'h5', attributes: {'id': '%value'}},
    h6: {block: 'h6', attributes: {'id': '%value'}},
  },
}
