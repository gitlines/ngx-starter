
import { relative } from 'path';
import { Bundler } from 'scss-bundle';
import { writeFile } from 'fs-extra';


/** Bundles all SCSS files into a single file */
async function bundleScss() {
  console.info('Bundling SCSS...');

  const library = 'elderbyte/ngx-starter';

  const base = './projects/' + library;
  const themePath = base + '/src/_theming.scss';
  const otherPath = base + '/src/**/*.scss';

  const { found, bundledContent, imports } = await new Bundler()
    .Bundle(themePath, [ otherPath ]);

  if (!found) {
    console.warn('Could not find scss source files in: ' + process.cwd() + ' ' + themePath);
  }


  if (imports) {
    const cwd = process.cwd();

    const filesNotFound = imports
      .filter(x => !x.found)
      .map(x => relative(cwd, x.filePath));

    if (filesNotFound.length) {
      console.error(`SCSS imports failed \n\n${filesNotFound.join('\n - ')}\n`);
      throw new Error('One or more SCSS imports failed');
    }
  }

  console.log('imports:', imports);

  if (found) {
    await writeFile('./dist/' + library + '/theming.scss', bundledContent);
  }
}

bundleScss();
