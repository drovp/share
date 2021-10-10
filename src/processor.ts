import * as FS from 'fs';
import * as Path from 'path';
import got from 'got';
import type {ProcessorUtils} from '@drovp/types';
import type {Payload} from './';

const manifest = require('../package.json');

export default async ({input}: Payload, {progress, output, appVersion}: ProcessorUtils) => {
	const filename = Path.basename(input.path);

	const response = await got
		.put(`https://transfer.sh/${filename}`, {
			headers: {
				'user-agent': `Drovp/${appVersion} ${manifest.name}/${manifest.version}`,
			},
			body: FS.createReadStream(input.path),
		})
		.on('uploadProgress', ({transferred, total}) => progress(transferred, total));

	if (response.statusCode === 200) {
		output.url(response.body);
	} else {
		output.error(`${response.statusCode}: ${response.statusMessage || response.body}`);
	}
};
