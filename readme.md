# esbuild-plugin-pipe

Pipe [esbuild](https://github.com/evanw/esbuild) plugins output.

<br>

> A pipe is a form of redirection that is used to send the output of one program to another program for further processing.

<br>

⚠️ The plugins have to [support](#support) piping.

<br>

### Install

```zsh
npm install esbuild-plugin-pipe --save-dev
```

<br>

### Use

`esbuild.config.js`

```js
import esbuild from 'esbuild';
import pipe from 'esbuild-plugin-pipe';

esbuild
    .build({
        entryPoints: ['index.js'],
        bundle: true,
        outfile: 'main.js',
        plugins: [
            pipe({
                plugins: [...]
            })
        ]
    })
    .catch(() => process.exit(1));
```

`package.json`

```json
{
    "type": "module",
    "scripts": {
        "start": "node esbuild.config.js"
    }
}
```

<br>

### Configure

`esbuild.config.js`

```js
pipe({
    filter: /.*/,
    namespace: '',
    plugins: []
});
```

<br>

### Support

If you are a plugin maker, it's really easy to support piping. Here’s a commented plugin example.

```js
const pluginExample = () => ({
    name: 'example',
    setup(build, { transform } = {}) {
        // The `setup` function receives a new `transform` argument if it’s in a pipe.

        // Create a function and move all the content of your `onLoad` function in it, except the `readfile`.
        const transformContents = ({ args, contents }) => {
            // It receives an object as an argument containing both the standard arguments of the `onLoad` function
            // and the `contents` of the previous plugin or file.

            // Move your code here. It should return `contents`.
            return { contents };
        };

        // If the `transform` argument exists, pass it to your new function.
        if (transform) return transformContents(transform);

        // Else call your `onLoad` function.
        build.onLoad({ filter: /.*/ }, async args => {
            // Read the files from disk.
            const contents = await fs.promises.readFile(args.path, 'utf8');

            // Call your function, but this time pass an object with the `onLoad` arguments and the file `contents`.
            return transformContents({ args, contents });
        });
    }
});

export default pluginExample;
```

<br>

### Check

[esbuild-plugin-babel](https://github.com/nativew/esbuild-plugin-babel) &nbsp; → &nbsp; Babel plugin for esbuild.

[esbuild-plugin-postcss-literal](https://github.com/nativew/esbuild-plugin-postcss-literal) &nbsp; → &nbsp; PostCSS tagged template literals plugin for esbuild.

<br>
