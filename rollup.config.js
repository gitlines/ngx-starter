export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/ngx-starter.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'ng.ngxStarter',
    globals: {
        '@angular/core': 'ng.core',
        '@angular/router': 'ng.router',
        '@angular/http': 'ng.http'
    },
    onwarn: function (warning) {
        // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        if (warning.code === 'THIS_IS_UNDEFINED'){
            return;
        }
        console.error(warning.message);
    }
}
