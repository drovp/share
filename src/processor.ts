import * as FS from 'fs';
import * as Path from 'path';
import got from 'got';
import type {ProcessorUtils} from '@drovp/types';
import type {Payload} from './';

const manifest = require('../package.json');

export default async ({item}: Payload, {progress, result, appVersion}: ProcessorUtils) => {
	const filename = Path.basename(item.path);

	const response = await got
		.put(`https://transfer.sh/${filename}`, {
			headers: {
				'user-agent': `Drovp/${appVersion} ${manifest.name}/${manifest.version}`,
			},
			body: FS.createReadStream(item.path),
		})
		.on('uploadProgress', ({transferred, total}) => progress(transferred, total));

	if (response.statusCode === 200) {
		result.url(response.body);
	} else {
		result.error(`${response.statusCode}: ${response.statusMessage || response.body}`);
	}
};
