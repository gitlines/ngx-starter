[![Build Status](https://travis-ci.org/ElderByte-/ngx-starter.svg?branch=master)](https://travis-ci.org/ElderByte-/ngx-starter)
[![npm version](https://badge.fury.io/js/%40elderbyte%2Fngx-starter.svg)](https://badge.fury.io/js/%40elderbyte%2Fngx-starter)


# ngx-starter (`@elderbyte/ngx-starter`)

Angular Web App Starter library containing highly reusable modules and configuration.


## Installation

To install this library, run:

```bash
$ npm install @elderbyte/ngx-starter --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install @elderbyte/ngx-starter
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { SampleModule } from '@elderbyte/ngx-starter';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    LibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<h1>
  {{title}}
</h1>
<sampleComponent></sampleComponent>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [ElderByte AG](mailto:info@elderbyte.com)
