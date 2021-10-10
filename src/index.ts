import {Plugin, PayloadData, makeAcceptsFlags} from '@drovp/types';

const acceptsFlags = makeAcceptsFlags()({
	files: true,
});

export type Payload = PayloadData<{}, typeof acceptsFlags>;

export default (plugin: Plugin) => {
	plugin.registerProcessor<Payload>('share', {
		main: 'dist/processor.js',
		description: 'Upload a file and get a URL to share with others.',
		accepts: acceptsFlags,
		threadType: 'upload',
	});
};
