import fs from 'fs';

const pluginMerge = (options = {}) => ({
	name: 'merge',
	setup(build) {
		const { filter = /.*/, namespace = '', plugins = [] } = options;

		build.onLoad({ filter, namespace }, async args => {
			const contents = await fs.promises.readFile(args.path, 'utf8');

			return plugins.reduce(
				async (transform, plugin) => {
					const { contents } = await transform;

					return plugin.setup(build, { args, contents });
				},
				{ contents }
			);
		});
	}
});

export default pluginMerge;
