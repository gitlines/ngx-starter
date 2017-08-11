import angular from 'rollup-plugin-angular-aot';
import sass from 'node-sass';
import CleanCSS from 'clean-css';
import {minify as minifyHtml} from 'html-minifier';
import typescript from 'rollup-plugin-typescript';
import alias from 'rollup-plugin-alias';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';


const cssmin = new CleanCSS();

const htmlminOpts = {
    caseSensitive: true,
    collapseWhitespace: true,
    removeComments: true,
};


export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/ngx-starter.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'ng.ngxStarter',
    plugins: [
        angular({
            preprocessors: {
                template: template => minifyHtml(template, htmlminOpts),
                style: scss => {
                    const css = sass.renderSync({data: scss}).css;
                    return cssmin.minify(css).styles;
                }
            }
        }),
        commonjs({
            include: 'node_modules/**'
        }),
       // alias({ rxjs: __dirname + '/node_modules/rxjs' }), // rxjs fix (npm install rxjs)
        nodeResolve({ jsnext: true, main: true })
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/router': 'ng.router',
        '@angular/http': 'ng.http'
    },
    onwarn: function (warning) {
        // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        /*
        if (warning.code === 'THIS_IS_UNDEFINED'){
            return;
        }*/
        console.error(warning.message);
    }
}

/*
'rxjs/Observable': 'Rx',
        'rxjs/ReplaySubject': 'Rx',
        'rxjs/BehaviorSubject': 'Rx',
        'rxjs/add/operator/map': 'Rx.Observable.prototype',
        'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
        'rxjs/add/operator/pluck': 'Rx.Observable.prototype',
        'rxjs/add/operator/first': 'Rx.Observable.prototype',
        'rxjs/add/observable/fromEvent': 'Rx.Observable',
        'rxjs/add/observable/merge': 'Rx.Observable',
        'rxjs/add/observable/throw': 'Rx.Observable',
        'rxjs/add/observable/of': 'Rx.Observable'
 */