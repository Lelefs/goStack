interface IMailConfig {
	driver: 'ethereal' | 'ses';

	defaults: {
		from: {
			email: string;
			name: string;
		};
	};
}

export default {
	driver: process.env.MAIL_DRIVER || 'ethereal',

	defaults: {
		from: {
			email: 'contato@brigadeirosdesonhos.com.br',
			name: 'Leandro do Brigadeiros de sonhos',
		},
	},
} as IMailConfig;
