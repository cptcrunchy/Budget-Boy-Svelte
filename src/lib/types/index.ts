
export type AlertMessageType = {
	alertType: 'success' | 'error' | 'warning' | 'info';
	alertText: string;
};

export type EnterKeyHintType =
	| 'search'
	| 'enter'
	| 'done'
	| 'go'
	| 'next'
	| 'previous'
	| 'send'
	| null
	| undefined;

// Type for prettifying an object type
export type PrettifyType<T> = {
	[K in keyof T]: T[K];
} & Record<string, never>;


export type GoogleUser = {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
};

export type RegistrationUser = {
  sub: string;
	name: string;
	picture?: string;
	email: string;
  password: string;
	isEmailVerified: boolean;
}


export type PendingVerificationUserDataType = {
	id: string;
	email: string;
};

export type EmailParams = {
	email: string;
	subject: string;
	htmlContent: string;
};
