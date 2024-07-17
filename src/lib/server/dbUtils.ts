import type { GoogleUser } from "$lib/DB";

async function getIfUserExists(email: string) {
  try {
    const existingUser = await prisma.User.findUnique({
      where: { email: email },
    });
    return existingUser;
  } catch (error) {
    console.error(error);
  }
}

async function getIfOAuthExits(providerId: string, googleUser: GoogleUser) {
  try {
    const existingOAuthAccount = await prisma.User.findUnique({
      where: {
        email: googleUser.email,
        oAuthAccounts: {
          some: {
            providerId,
            providerUserId: googleUser.sub,
          },
        },
      },
    });
    return existingOAuthAccount;
  } catch (error) {
    console.error(error);
  }
}

async function insertNewUser(user: GoogleUser) {
  console.log({ user });
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email, // Using email as username
      picture: user.picture, // Name field may not always be present, handle accordingly
      oAuthAccounts: {
        create: {
          providerId: "google",
          providerUserId: user.sub,
        },
      },
    },
  });
  console.log({ newUser });
  return newUser;
}

async function updateUserOAuth(user: GoogleUser) {
  await prisma.User.update({
    where: { email: user.email },
    data: {
      oAuthAccunts: {
        create: {
          providerId: "google",
          providerUserId: user.sub,
        },
      },
    },
    include: { oAuthAccounts: true },
  });
}

export { getIfUserExists, getIfOAuthExits, insertNewUser, updateUserOAuth };