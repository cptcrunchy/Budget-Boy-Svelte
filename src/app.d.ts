// See https://kit.svelte.dev/docs/types#app

import type { PrismaClient } from "@prisma/client/extension";
import type { Session, User } from 'lucia';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
      user: User | null;
      session: Session | null;
    }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
  var prisma: PrismaClient;
}

export {};
