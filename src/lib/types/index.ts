
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

export type OAuthUser = {
  id: string | number;
	name?: string;
	avatar_url?: string;
	email?: string;
	email_verified?: boolean;
  login?: string;
}

export type GoogleUser = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export type GitHubUser = {
	id: number;
	login: string;
	avatar_url: string;
	name: string;
}

export type RegistrationUser = {
  sub: string;
	name: string;
	avatar_url?: string;
	email: string;
	email_verified: boolean;
  password: string;
}

export type GitHubEmail = {
	email: string;
	primary: boolean;
	verified: boolean;
	visibility: string | null;
};

export type PendingVerificationUserDataType = {
	id: string;
	email: string;
};

export type EmailParams = {
	email: string;
	subject: string;
	htmlContent: string;
};
