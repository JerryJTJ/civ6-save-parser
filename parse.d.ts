type Options = {
	simple?: boolean;
	clean?: boolean;
	outputCompressed?: boolean;
};

export function parse(buffer: Buffer, options: Options): any;
