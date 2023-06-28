import { Editor } from 'tinymce';
import { slugify } from '../helpers/slugify';

export const TinyMceConfig = {
  plugins: ['lists', 'link', 'image', 'media', 'code', 'codesample', 'anchor', 'wordcount'],
  menubar: 'view insert format',
  toolbar:
    'h1 h2 h3 | codesample bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | image link media anchor',
  codesample_global_prismjs: true,
  codesample_languages: [
    { text: 'Kotlin', value: 'kotlin' },
    { text: 'HTML/XML', value: 'markup' },
    { text: 'TypeScript', value: 'typescript' },
    { text: 'Rust', value: 'rust' },
    { text: 'Python', value: 'python' },
    { text: 'Java', value: 'java' },
    { text: 'Bash', value: 'bash' }
  ],
  browser_spellcheck: true,
  skin: '',
  content_css: '',
  forced_root_block_attrs: {
    class: 'base-block'
  },
  setup: function (ed: Editor) {
    ed.on('NodeChange', (e) => {
      const element = e.element;
      if (element.localName.startsWith('h') && parseInt(element.localName.charAt(1)) > 0) {
        element.id = slugify(element.innerHTML) + '-' + rand();
      }
    });
  }
};

function rand(): string {
  return Math.random().toString(36).slice(2);
}
