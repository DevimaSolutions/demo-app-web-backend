export const passwordRegexp = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()\-_+={}[\]|\\;:"<>,.\/?])[A-Za-z\d~`!@#$%^&*()\-_+={}[\]|\\;:"<>,.\/?]{8,}$/,
);

export const usernameRegexp = new RegExp(/^(([A-z0-9_](?!\\)){3,255})$/);
