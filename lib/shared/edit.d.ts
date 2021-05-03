declare const editInProfiles: (directory: string, profiles: string[], name: string, rename: string, enabled: boolean, permissions: string, type: string) => Promise<string[]>;
export { editInProfiles };
